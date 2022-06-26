import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, StatusBar, SafeAreaView } from 'react-native';

import CurrentPrice from './src/components/CurrentPrice'
import HistoryGraphic from './src/components/HistoryGraphic'
import QuotationsList from './src/components/QuotationsList';
import QuotationsItems from './src/components/QuotationsList/QuotationsItems'

function addZero(number) {
  if (number <= 9) {
    return "0" + number
  }
  return number
}

function url(qtdDias) {
  const date = new Date();
  const listLastDays = qtdDias;
  const end_date = 
  `${date.getFullYear()}-${addZero(date.getMonth() + 1)}-${addZero(date.getDate())}`;
  date.setDate(date.getDate() - listLastDays);
  const start_date = 
  `${date.getFullYear()}-${addZero(date.getMonth() + 1)}-${addZero(date.getDate())}`;
  //URL  GET API
  return `https://api.coindesk.com/v1/bpi/historical/close.json?start=${start_date}&end=${end_date}`;;
}

async function getListCoins(url) {
  let response = await fetch(url);
  let returnApi = await response.json();
  let selectListQuotations = returnApi.bpi;
  const queryCoinsList = Object.keys(selectListQuotations).map((key) => {
    return {
      data: key.split("-").reverse().join("/"),
      valor: selectListQuotations[key],
    };
  });
  let data = queryCoinsList.reverse();
  return data;
}

async function getPriceCoinsGraphic(url) {
  let responseG = await fetch(url);
  let returnApiG = await responseG.json();
  let selectListQuotationsG = returnApiG.bpi;
  const queryCoinsListG = Object.keys(selectListQuotationsG).map((key) => {
    return selectListQuotationsG[key];
  });
  let dataG = queryCoinsListG;
  return dataG;
}

export default function App() {
  const [coinsList, setcoinsList] = useState([]);
  const [coinsGrafichList, setcoinsGrafichList] = useState([0]);
  const [days, setdays] = useState(30);
  const [updateData, setupdateData] = useState(true);
  const [price, setPrice] = useState();

  function updateDay(number) {
    setdays(number);
    setupdateData(true);
  }

  function priceCotation(){
    setPrice(coinsGrafichList.pop())
  }

  useEffect(() => {
    getListCoins(url(days)).then((data) => {
      setcoinsList(data);
    });
    getPriceCoinsGraphic(url(days)).then((dataG) => {
      setcoinsGrafichList(dataG);
    });
    priceCotation()
    if (updateData) {
      setupdateData(false);
    }
  }, [updateData]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
      backgroundColor="#f50d41"
      barStyle="dark-content"
       />
      <CurrentPrice lastCotation={price}/>
      <HistoryGraphic infoDataGraphic={coinsGrafichList} />
      <QuotationsList 
        filterDay={updateDay} 
        listTransactions={coinsList}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    //paddingTop: Plataform.OS === "android" ? 40: 0
  },
});

