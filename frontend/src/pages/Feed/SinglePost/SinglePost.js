import React, { Component } from 'react';
import { withRouter } from '../../../hoc/with-router';

import Image from '../../../components/Image/Image';
import './SinglePost.css';

class SinglePost extends Component {
    state = {
        title: '',
        author: '',
        date: '',
        image: '',
        content: '',
    };

    componentDidMount() {
        const postId = this.props.params.postId;
        fetch('http://localhost:8080/feed/post/' + postId, {
            headers: {
                Authorization: 'Bearer ' + this.props.token,
            },
        })
            .then((res) => {
                if (res.status !== 200) {
                    throw new Error('Failed to fetch post');
                }
                return res.json();
            })
            .then((resData) => {
                // Check if post and creator exist
                if (resData.post && resData.post.creator) {
                    this.setState({
                        title: resData.post.title,
                        author: resData.post.creator.name || 'Unknown',
                        image: 'http://localhost:8080/' + resData.post.imageUrl,
                        date: new Date(resData.post.createdAt).toLocaleDateString('en-US'),
                        content: resData.post.content,
                    });
                } else {
                    // Handle case where post or creator is missing
                    console.error('Post or creator is missing in the response');
                }
            })
            .catch((err) => {
                console.error('Error fetching post:', err);
            });
    }

    render() {
        return (
            <section className="single-post">
                <h1>{this.state.title}</h1>
                <h2>
                    Created by {this.state.author} on {this.state.date}
                </h2>
                <div className="single-post__image">
                    <Image contain imageUrl={this.state.image} />
                </div>
                <p>{this.state.content}</p>
            </section>
        );
    }
}

export default withRouter(SinglePost);
