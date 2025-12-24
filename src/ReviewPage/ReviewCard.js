const ReviewCard = ({ review, currentUserUsername, onDelete }) => {
  const isAuthor = currentUserUsername === review.author_username;
  const authorName = review.author_first_name || review.author_username || 'Аноним';

  let formattedDate = 'Дата неизвестна';
  if (review.date_created) {
    try {
      const dateObj = new Date(review.date_created);
      // Форматирую в локальный формат (например, 05.10.2024)
      formattedDate = dateObj.toLocaleDateString('ru-RU', {
        year : 'numeric',
        month: '2-digit',
        day  : '2-digit',
      });

    } catch (e) {
      console.error("Ошибка форматирования даты:", e);
    }
  }

    return (
      <div className="review_block">
        <h3> {authorName }</h3>
        <h5 className="txt_prim_clr"> {formattedDate} </h5>
        <h4 className="txt_prim_clr"> {review.feedback}     </h4>
        <div className="review_bottom_container">
          <h1 className="review_evol_txt"> {review.evaluation}/10</h1>
          {review.is_published === false && (
          <h5 className="moderation_info"> Ваш отзыв ожидает модерации</h5>
          )}
          {isAuthor && (
            <div className="review_btn">
              <button className="btn2" onClick={() => onDelete(review.id)}>Удалить</button>
            </div>
          )}
        </div>
      </div>
    );
}

export default ReviewCard;