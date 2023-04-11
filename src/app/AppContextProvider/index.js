import React, { useEffect, useState } from 'react';
import AppContext from './AppContext';

const AppContextProvider = ({ children }) => {
  const [headerData, setHeaderData] = useState("gdyhvfgbsdvb")
  const [titleData, setTitleData] = useState("")
  const [subTitleData, setSubTitleData] = useState("")
  const [locationData, setLocationData] = useState(null)

  const contextValue = React.useMemo(() => {
    return {
      headerData,
      setHeaderData,
      titleData,
      setTitleData,
      subTitleData,
      setSubTitleData,
      locationData,
      setLocationData
    };
  }, [headerData, titleData, subTitleData, locationData]);


  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
