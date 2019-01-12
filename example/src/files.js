import React, { PureComponent, Suspense, Fragment } from 'react';
import { Auth, Firestore, Storage } from 'react-firebase-context';

class UserFiles extends PureComponent {
  render () {
    return (
      <Auth>
        {({ getUserData }) => {
          const user = getUserData();
          return (
            <Firestore
              query={({ firestore }) =>
                firestore.collection('files').where('userUid', '==', user.uid)}
            >
              {({ data, firestore }) => (
                <Storage>
                  {({ storage }) => {
                    return (
                      <Fragment>
                        <h2>Files</h2>
                        {!data.length ? (
                          <p>No files found!</p>
                        ) : (
                          <ul>
                            {data.map((item) => {
                              const fileRef = storage
                                .ref()
                                .child(item.data.path);
                              return (
                                <li>
                                  <a
                                    href="#"
                                    onClick={() =>
                                      fileRef
                                        .getDownloadURL()
                                        .then((url) => window.open(url))}
                                  >
                                    {fileRef.name}
                                  </a>{' '}
                                  -{' '}
                                  <a
                                    href="#"
                                    onClick={() =>
                                      fileRef
                                        .delete()
                                        .then(() =>
                                          firestore
                                            .collection('files')
                                            .doc(item.id)
                                            .delete()
                                        )}
                                  >
                                    delete
                                  </a>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                        <h3>Upload file</h3>
                        <form ref={(e) => (this.fileForm = e)}>
                          <input
                            type="file"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              const fullPath = `${user.uid}/${file.name}`;
                              console.log({ e, file });
                              if (file) {
                                storage
                                  .ref()
                                  .child(fullPath)
                                  .put(file, {
                                    customMetadata: {
                                      userUid: user.uid
                                    }
                                  })
                                  .then(() => {
                                    firestore.collection('files').add({
                                      userUid: user.uid,
                                      path: fullPath
                                    });
                                    this.fileForm.reset();
                                  });
                              }
                            }}
                          />
                        </form>
                      </Fragment>
                    );
                  }}
                </Storage>
              )}
            </Firestore>
          );
        }}
      </Auth>
    );
  }
}

export default UserFiles;
