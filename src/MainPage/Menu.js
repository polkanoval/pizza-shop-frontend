
import '../App.css';
import MenuCard from './MenuCard';
import useFetch from "../components/UI/useFetch";

function Menu() {
  const { data, loading, error} = useFetch('menu/')

  if (loading) return <p>Загрузка меню...</p>;
  if (error) return <p>Ошибка при загрузке: {error.message}</p>;

  return (
    <div className="menu" id="html_menu">
      <h2>Меню</h2>
      <div className="menu_blocks">
        <div className="menu_row" >
          {data.map(product => (
            <MenuCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </div>
    </div>

    );}

export default Menu;