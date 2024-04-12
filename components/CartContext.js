const { createContext, useState, useEffect } = require("react");

export const CartContext = createContext({});

export function CartContextProvider({ children }) {
    const ls = typeof window !== "undefined" ? window.localStorage : null;
  const [cartProducts, setCartproducts] = useState([]);
  useEffect(() => {  
    if(cartProducts?.length > 0) {
        ls?.setItem('cart',JSON.stringify(cartProducts));
    }
}, [cartProducts]);
useEffect(() => {
    if(ls && ls.getItem('cart')) {
        setCartproducts(JSON.parse(ls.getItem('cart')));
    }
}, []);
  function addProduct(productId){
    setCartproducts(prev => [...prev, productId]);
  }
  return (
    <CartContext.Provider value={{ cartProducts, setCartproducts, addProduct}}>
      {children}
    </CartContext.Provider>
  );
}
