import '../App.css';
import DiscountCard from './DiscountCard';
import useFetch from "../components/UI/useFetch";

function Discount() {

const { data, loading, error} = useFetch('discount/')
if (loading) return <p>Загрузка акций...</p>;
if (error) return <p>Ошибка при загрузке: {error.message}</p>;
return (
   <div className="discount" id="html_discount">
      <h2>Акции</h2>
      <div className="discounts">
        {data.map(product => (
          <DiscountCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </div>
);
}

export default Discount;