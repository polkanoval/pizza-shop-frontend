import '../App.css';

function DiscountCard ({ product }) {

return (
   <div className="discount_block">
      <h3 className="txt_prim_clr">{product.name} </h3>
      <h4 className="txt_prim_clr">{product.text} </h4>
      <img  src={product.image} className="menu_img" alt={product.image}/>
    </div>
);
}

export default DiscountCard;