import React, { useEffect, useState } from 'react';
import ReviewCard from '../components/ReviewCard.jsx';
import { useLocation, useNavigate } from 'react-router-dom';

const API = 'http://localhost:5001/api/reviews';
const emptyForm = {
    rev_title: '',
    rev_text: '',
    rating: 5,
    game_title: '',
    username: ''
};

const ReviewPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [reviews, setReviews] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (location.state?.gameTitle) return;
        fetch(API)
            .then(r => r.json())
            .then(d => setReviews(Array.isArray(d) ? d : []))
            .catch(() => setError('Failed to load reviews.'));
    }, []);

    // Reviews for a specific game
    useEffect(() => {
        if (!location.state || Object.keys(location.state).length === 0) return;

        const gameTitle = location.state?.gameTitle;
        if (gameTitle) {
            fetch(`http://localhost:5001/api/reviews/game/${encodeURIComponent(gameTitle)}`)
                .then((res) => res.json())
                .then((data) => {
                    setReviews(Array.isArray(data) ? data : []);
                })
                .catch((err) => {
                    console.log("Error fetching filtered reviews: ", err);
                })
        }

        navigate(location.pathname, {replace:true, state:{}});
    }, [location.state])

    const onChange = e =>
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const resetForm = () => {
        setForm(emptyForm);
        setEditingId(null);
        setError('');
    };

    const createReview = async e => {
        e.preventDefault();
        setBusy(true);
        setError('');

        try {
            const res = await fetch(API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...form,
                    rating: Number(form.rating)
                })
            });

            if (!res.ok) throw 0;

            const created = await res.json();
            setReviews(l => [created, ...l]);
            resetForm();
        } catch {
            setError('Could not create review.');
        } finally {
            setBusy(false);
        }
    };

    const beginEdit = id => {
        const r = reviews.find(x => x.rev_id === id);
        if (!r) return;

        setEditingId(id);
        setForm({
            rev_title: r.rev_title ?? '',
            rev_text: r.rev_text ?? '',
            rating: r.rating ?? 5,
            game_title: r.game_title ?? '',
            username: r.username ?? ''
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const updateReview = async e => {
        e.preventDefault();
        if (!editingId) return;

        setBusy(true);
        setError('');

        try {
            const res = await fetch(`${API}/${editingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    rev_title: form.rev_title,
                    rev_text: form.rev_text,
                    rating: Number(form.rating),
                    game_title: form.game_title,  
                    username: form.username
                })
            });

            if (!res.ok) throw 0;

            const updated = await res.json();

            setReviews(l =>
                l.map(r => (r.rev_id === editingId ? updated : r))
            );

            resetForm();
        } catch {
            setError('Could not update review.');
        } finally {
            setBusy(false);
        }
    };

    const deleteReview = async id => {
        if (!window.confirm('Delete this review?')) return;

        const prev = reviews;
        setReviews(l => l.filter(r => r.rev_id !== id));

        try {
            const res = await fetch(`${API}/${id}`, {
                method: 'DELETE'
            });

            if (!res.ok) throw 0;
        } catch {
            setError('Could not delete review.');
            setReviews(prev);
        }
    };

    const onSubmit = editingId ? updateReview : createReview;

    return (
        <div className="reviews">
            <div className="add-review-container">
                <h1 className="add-review-title">
                    {editingId ? 'EDIT REVIEW' : 'ADD A REVIEW'}
                </h1>

                <form className="add-review-form" onSubmit={onSubmit}>
                    {error && <div className="error">{error}</div>}

                    <label>
                        Title
                        <input
                            name="rev_title"
                            value={form.rev_title}
                            onChange={onChange}
                            required
                        />
                    </label>

                    <label>
                        Review Text
                        <textarea
                            name="rev_text"
                            value={form.rev_text}
                            onChange={onChange}
                            required
                        />
                    </label>

                    <label>
                        Rating (1–5)
                        <input
                            type="number"
                            name="rating"
                            min="1"
                            max="5"
                            step="1"
                            value={form.rating}
                            onChange={onChange}
                            required
                        />
                    </label>
                    <label>
                        Game Title
                        <input
                            name="game_title"
                            value={form.game_title}
                            onChange={onChange}
                            required
                        />
                    </label>
                    <label>
                        Username
                        <input
                            name="username"
                            value={form.username}
                            onChange={onChange}
                            required
                        />
                    </label>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            type="submit"
                            disabled={busy}
                            className="add-review-btn"
                        >
                            {editingId ? 'Update Review' : 'Add Review'}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="add-review-btn"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <h1 className="page-title">Reviews</h1>

            <div className="review-cards">
                {reviews.map(r => (
                    <ReviewCard
                        key={r.id}
                        id={r.id}
                        title={r.title}
                        text={r.text}
                        date={(r.date ?? '').toString().substring(0, 10)}
                        rating={r.rating}
                        game_title={r.game_title}
                        username={r.username}
                        onEdit={beginEdit}
                        onDelete={deleteReview}
                    />
                ))}
            </div>
        </div>
    );
};

export default ReviewPage;
