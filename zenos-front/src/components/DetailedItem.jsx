import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DetailedItem.css';

function DetailedItem({ establishment }) {
    const navigate = useNavigate();
    const imageUrl = `https://picsum.photos/id/${establishment?.id}/500/500/?`;

    return (
        <div className="detailed-item">
            <div className="detailed-item-content">
                <div className="detailed-item-header">
                    <div className="detailed-item-info">
                    <h1 className="detailed-item-name">{establishment.name}</h1>
                    <div className="detailed-item-category">{establishment.category.name}</div>
                    </div>
                    <div className="detailed-item-rating">
                        <span className="rating-value">{establishment.avg_rating}</span>
                        <span className="rating-stars">{'★'.repeat(Math.round(establishment.avg_rating))}</span>
                    </div>
                </div>
                
                <div className="detailed-item-info">
                    {establishment.address && (
                        <div className="info-row">
                            <span className="info-label">Address:</span>
                            <span className="info-value">{establishment.address}</span>
                        </div>
                    )}
                    {establishment.city && (
                        <div className="info-row">
                            <span className="info-label">City:</span>
                            <span className="info-value">{establishment.city}</span>
                        </div>
                    )}
                </div>

                {establishment.description && (
                    <div className="detailed-item-description">
                        <h2>Description</h2>
                        <p>{establishment.description}</p>
                    </div>
                )}
                <div className="detailed-item-actions">
                    <button
                        type="button"
                        className="btn-link"
                        onClick={() => establishment?.id && navigate(`/products?establishment_id=${establishment.id}`)}
                    >
                        Ver produtos
                    </button>
                    <button
                        type="button"
                        className="btn-link"
                        onClick={() => establishment?.id && navigate(`/products?establishment_id=${establishment.id}`)}
                    >
                        Fazer pedido!
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DetailedItem;