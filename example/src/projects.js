import React, { PureComponent, Suspense, Fragment } from 'react';
import { Auth, Firestore } from 'react-firebase-context';

class UserProjects extends PureComponent {
  state = {
    projectName: ''
  };

  render () {
    return (
      <Auth>
        {({ getUserData }) => {
          const user = getUserData();
          return (
            <Firestore
              query={({ firestore }) =>
                firestore
                  .collection('projects')
                  .where('userUid', '==', user.uid)}
            >
              {({ data, firestore }) => (
                <Fragment>
                  <h2>Projects</h2>
                  {data.length ? (
                    <ul>
                      {data.map((item) => (
                        <li>
                          {item.data.name} -{' '}
                          <a
                            href="#"
                            onClick={() =>
                              firestore
                                .collection('projects')
                                .doc(item.id)
                                .delete()}
                          >
                            remove
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No projects found.</p>
                  )}
                  <h3>Create Project</h3>
                  <input
                    type="text"
                    value={this.state.projectName}
                    onChange={(e) =>
                      this.setState({
                        projectName: e.target.value
                      })}
                  />
                  <button
                    disabled={!this.state.projectName}
                    onClick={() => {
                      firestore.collection('projects').add({
                        name: this.state.projectName,
                        userUid: user.uid
                      });
                      this.setState({ projectName: '' });
                    }}
                  >
                    Add Project
                  </button>
                </Fragment>
              )}
            </Firestore>
          );
        }}
      </Auth>
    );
  }
}

export default UserProjects;
