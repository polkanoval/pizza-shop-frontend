import { useState, useEffect } from 'react';

const ProfileEdit = ({ label, initialValue, type, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);         // использую для отображения
  const [tempValue, setTempValue] = useState(initialValue); // использую в режиме редактирования

  useEffect(() => {
    //Если родительский компонент обновил initialValue (после успешного API запроса),
    //обновляем и локальное состояние value и tempValue
    setValue(initialValue);
    setTempValue(initialValue);
  }, [initialValue]);

  //Изменить
  const handleEditClick = () => {
    setTempValue(type === "password"? '' : value);
    setIsEditing(true);
  };

  //Сохранить
  const handleSaveClick = () => {
    //Обновляю value здесь для немедленного отображения в режиме чтения
    setValue(tempValue);
    setIsEditing(false);
    //Отправляем данные на сервер через пропс onSave
    onSave(label, tempValue);
  };

  //Отмена редактирования
  const handleCancelClick = () => {
    setIsEditing(false);
    //Сброс tempValue к текущему сохраненному значению
    setTempValue(value);
  };

  const handleChange = (event) => {
    setTempValue(event.target.value);
  };

  return (
    <div className="editable-field">
      {isEditing ? (
        <>
          <div className="profile_edit">
            <input
              className="infotxt"
              type={type || "text"}
              value={tempValue}
              onChange={handleChange}
            />
            <h5 className="profile_save" onClick={handleSaveClick} style={{ cursor: 'pointer' }}>
              Сохранить
            </h5>
          </div>
          <h5 className="profile_cancel" onClick={handleCancelClick} style={{ cursor: 'pointer' }}>
            Отмена
          </h5>
        </>
      ) : (
        <div className="profile_edit">
          <input className="infotxt"
            type={type || "text"}
            value={value}
            readOnly
          />
          <h5 onClick={handleEditClick} style={{ cursor: 'pointer' }}>Изменить</h5>
        </div>
      )}
    </div>
  );
};

export default ProfileEdit;