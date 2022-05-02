// React & React Router
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// Components
import ErrorPage from "../components/ErrorPage.jsx";
import CommentsList from "../components/CommentsList.jsx";

/// Utilities
import { BiDislike, BiLike } from "react-icons/bi";
import * as api from "../utils/api.js";
import formatDate from "../utils/formatDate.js";
// import VoteCounter from "../components/VoteCounter.jsx";

const ArticlePage = ({ user }) => {
  const { article_id } = useParams();
  const [article, setArticle] = useState({});
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [postConfirmed, setPostConfirmed] = useState(false);
  const [voteCount, setVoteCount] = useState(0);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
      author: user,
      article_id,
    });
  };

  const handleUpVote = (e) => {
    e.preventDefault();
    setVoteCount((currVote) => {
      return currVote + 1;
    });
    api
      .patchArticle(article_id, 1)
      .then(() => {
        setIsLoading(false);
        setError(null);
      })
      .catch(
        ({
          response: {
            data: { msg },
            status,
          },
        }) => {
          setError({ status, msg });
          setIsLoading(false);
        }
      );
  };

  const handleDownVote = (e) => {
    e.preventDefault();
    setVoteCount((currVote) => {
      return currVote - 1;
    });
    api
      .patchArticle(article_id, -1)
      .then(() => {
        setIsLoading(false);
        setError(null);
      })
      .catch(
        ({
          response: {
            data: { msg },
            status,
          },
        }) => {
          setError({ status, msg });
          setIsLoading(false);
        }
      );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    api
      .postComment(formData)
      .then((response) => {
        setIsLoading(false);
        setError(null);
        setPostConfirmed(true);
      })
      .catch(
        ({
          response: {
            data: { msg },
            status,
          },
        }) => {
          setError({ status, msg });
          setIsLoading(false);
        }
      );
  };

  useEffect(() => {
    setIsLoading(true);
    api
      .getArticle(article_id)
      .then((article) => {
        setArticle(article);
        setIsLoading(false);
        setPostConfirmed(false);
      })
      .catch(() => {
        setError(true);
        setIsLoading(false);
      });
  }, [article_id]);

  if (error) return <ErrorPage />;
  if (isLoading) return <p>Loading....</p>;

  return (
    <>
      <section className={postConfirmed ? "fadeIn" : "fadeOut"}>
        <div className='alert alert-success'>
          <strong>Success! </strong>Thanks for your comment, {user}!
        </div>
      </section>

      <main id='article'>
        <article className='article__full-article'>
          <header className='article__card-header'>
            <h2 className='article__h2'>{article.title}</h2>
            <div className='article--metadata'>
              <span className='author-metadata__article'>
                by {article.author}
                on {formatDate(article.created_at)}
              </span>
              <span className='topic--metadata__article'>{article.topic}</span>
              <span className='comment-count--metadata__article'>
                {article.comment_count} comments
              </span>
            </div>
          </header>
          <p>{article.body}</p>
        </article>

        <div className='vote-count'>
          <button className='button__upVote' onClick={handleUpVote}>
            <BiLike />
          </button>
          <span className='vote--counter'>{article.votes + voteCount}</span>
          <button className='button__downVote' onClick={handleDownVote}>
            <BiDislike />
          </button>
        </div>
        <section className='form--add--comment'>
          <fieldset>
            <form onSubmit={handleSubmit}>
              <label htmlFor='body' className='label__comment--body'>
                Join the conversation
              </label>
              <textarea
                className='textarea__comment--body'
                name='body'
                placeholder='Type your thoughts here...'
                onChange={handleChange}
                cols='120'
                rows='4'
                required
              ></textarea>
              <button className='button__comment-submit'>Submit Comment</button>
            </form>
          </fieldset>
        </section>
        <CommentsList />
      </main>
    </>
  );
};

export default ArticlePage;
