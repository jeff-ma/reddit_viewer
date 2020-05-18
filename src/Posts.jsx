import React from 'react';
import Post from './Post';

export default ({addToFavorites, posts}) => {
    let content;
    if (posts && posts.length > 0) {
        content = posts.map((post) => 
            <Post key={post.data.id} post={post} addToFavorites={addToFavorites}/>
        );
    } else {
        content = <p>Sorry couldn't find that subreddit. Try searching again.</p>;
    }
    return (
        <>
            <h2>Posts</h2>
            {content}
        </>
    );
}