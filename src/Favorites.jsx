import React from 'react';
import Post from './Post';

export default ({favorites, removeFromFavorites, undo, redo}) => {
  let content;
  if (favorites && favorites.length > 0) {
      content = favorites.map((post) => 
        <Post key={post.data.id} post={post} removeFromFavorites={removeFromFavorites}/>
      );
  } else {
      content = <p>You have no favorites.</p>;
  }
  return (
      <>
        <div id="favorites-header">
          <h2>Favorites</h2>
          <div><button onClick={undo}>Undo</button></div>
          <div><button onClick={redo}>Redo</button></div>
        </div>
        {content}
      </>
  );
}