import {createContext, useContext, useEffect, useState} from 'react';

const CarContext = createContext({
  car: null,
  setCar: () => {},
});

export const useCar = () => useContext(CarContext);

const CarProvider = ({ children }) => {
    const [car, setCar] = useState(null);
    console.log(car)

    useEffect(() => {
        setCar(localStorage.getItem('aUneVoiture') === "1")
    }, [car]);

  return (
    <CarContext.Provider value={{ car, setCar }}>
      {children}
    </CarContext.Provider>
  );
};

export default CarProvider;