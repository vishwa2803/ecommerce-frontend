const { createContext, useState, useEffect } = require("react");

export const CartContext = createContext({});

export function CartContextProvider({ children }) {
    const ls = typeof window !== "undefined" ? window.localStorage : null;
  const [cartProducts, setCartProducts] = useState([]);
  useEffect(() => {  
    if(cartProducts?.length > 0) {
        ls?.setItem('cart',JSON.stringify(cartProducts));
    }
}, [cartProducts,ls]);
useEffect(() => {
    if(ls && ls.getItem('cart')) {
        setCartProducts(JSON.parse(ls.getItem('cart')));
    }
}, [ls]);
  function addProduct(productId){
    setCartProducts(prev => [...prev, productId]);
  }
  function removeProduct(productId){
    setCartProducts(prev => {
      const pos = prev.indexOf(productId);
      if(pos !== -1){
        // console.log(pos);
        const updatedCart = prev.filter((value,index) => index !== pos);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
      return updatedCart;
      }
      
      return prev;
    });
  }
  function clearCart() {
    // setCartProducts([]);
    ls.removeItem('cart');
  }
  return (
    <CartContext.Provider value={{ cartProducts, setCartProducts, addProduct, removeProduct,clearCart}}>
      {children}
    </CartContext.Provider>
  );
}
