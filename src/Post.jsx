import React from 'react';

export default ({post, addToFavorites, removeFromFavorites}) => {
    const {data} = post;
    return (
        <div className="post">
            <p>
                <a href={`https://www.reddit.com/${data.subreddit_name_prefixed}`} target="_blank" rel="noopener noreferrer"> {data.subreddit_name_prefixed}</a> Posted by u/{post.data.author} Post id {post.data.id}
            </p>
            <h2>
                <a href={data.url} target="_blank" rel="noopener noreferrer">{post.data.title}</a>
            </h2>
            <div className="post-stats">
                <p>{data.ups} Upvotes | {data.num_comments} Comments | Post Id {post.data.id}</p> 
                <div>
                    {addToFavorites ?
                        <span className="add" onClick={() => addToFavorites(post)}>★</span>
                        :
                        <span className="add" onClick={() => removeFromFavorites(data.id)}>X</span>
                    }
                </div>
            </div>
        </div>
    );
};