import React, { Component } from 'react';
import { autobind } from 'core-decorators';
import firebase from 'firebase/app';
import invariant from 'invariant';
import FirestoreContext from './context';

import 'firebase/firestore';

@autobind
class FirestoreProvider extends Component {
  constructor (props) {
    super(props);

    // State is used for caching snapshot data
    this.state = {};

    this.firestore = firebase.firestore();
    const { query, children, ...customSettings } = props;
    this.firestore.settings({ ...customSettings, timestampsInSnapshots: true });
  }

  /**
   * Creates unique hashes from query objects. Needs to be able to handle
   * both list queries and document requests
   * @param  {Object} query
   * @return {String}
   */
  queryHash (query) {
    let hash;
    if (query._query) {
      const segments = query._query.path.segments;
      const filters = query._query.filters;
      const orderBy = query._query.orderBy;

      hash = segments.join('|');
      hash += '::';
      hash += filters
        .map((f) => f.field.segments.join('|') + f.op.name + f.value.toString())
        .join('+');
      hash += '::';
      hash += orderBy
        .map((o) => o.field.segments.join('|') + '|' + o.dir.name)
        .join('+');
    } else {
      hash = query.path;
    }
    return hash;
  }

  /**
   * Basically just handles the two cases of single and multiple queries by
   * checking weather or not the response of the query function is an Array
   * @param  {Function} queryFunction
   * @return {Object|Array}
   */
  query (queryFunction) {
    const q = queryFunction({ firestore: this.firestore });
    return Array.isArray(q)
      ? q.map((query) => this.queryResolve(query))
      : this.queryResolve(q);
  }

  /**
   * This is where the "magic" happens .. the given query gets resolved by either
   * returning the requested data from the cache if available, or throwing a promise
   * (and therefore suspending the rendering), requesting the data from firebase and
   * storing the data in the cache (while registering the snapshot listener), before
   * resolving the thrown promise (which will cause a rerender)
   * @param  {Object} query
   * @return {Object}
   */
  queryResolve (query) {
    // Single query
    invariant(
      query.onSnapshot,
      'Invalid query passed! You must pass in a query that provides the ' +
        '`onSnapshot` method!'
    );

    const hash = this.queryHash(query);
    if (this.state[hash]) {
      return this.state[hash];
    } else {
      throw new Promise((resolve, reject) => {
        query.onSnapshot((snapshot) => {
          if (snapshot.forEach) {
            // Query snapshot
            // Loop through the snapshot items and build up a list array
            let list = [];
            snapshot.forEach((item) => {
              list.push({
                id: item.id,
                data: item.data(),
                __snapshot: item,
                __list: snapshot
              });
            });
            this.setState((state) => {
              const newState = { ...state };
              newState[hash] = list;
              list.forEach((item) => {
                // Seperately, push individual items as well
                // This way we benefit from already loaded items from lists
                // when we request them as items later on! :)
                newState[this.queryHash(item.__snapshot.ref)] = {
                  id: item.id,
                  data: item.data,
                  __snapshot: item.__snapshot
                };
              });
              return newState;
            }, resolve);
          } else {
            // Item snapshot
            this.setState(
              (state) => ({
                ...state,
                [this.queryHash(snapshot.ref)]: {
                  id: snapshot.id,
                  data: snapshot.data(),
                  __snapshot: snapshot
                }
              }),
              resolve
            );
          }
        });
      });
    }
  }

  render () {
    return (
      <FirestoreContext.Provider
        value={{
          data: this.state,
          query: this.query,
          firestore: this.firestore
        }}
      >
        {this.props.children}
      </FirestoreContext.Provider>
    );
  }
}

export default FirestoreProvider;
