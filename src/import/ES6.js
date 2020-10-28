import https from "https";

let dataAmiibo = [];
const typeSet = new Set();
const charactersSet = new Set();
const amiiboSeriesSet = new Set();
const gameSeriesSet = new Set();

class ES6 {
  formatJson = (amiiboArray) => {
    let formatedJson = { amiibo: [] };

    amiiboArray.forEach((element) => {
      formatedJson.amiibo.push({ name: element });
    });

    return formatedJson;
  };

  get getDataAmiibo() {
    return { amiibo: dataAmiibo };
  }

  get getTypes() {
    return this.formatJson(typeSet);
  }

  get getCharacters() {
    return this.formatJson(charactersSet);
  }

  get getAmiiboSeries() {
    return this.formatJson(amiiboSeriesSet);
  }

  get getGameSeries() {
    return this.formatJson(gameSeriesSet);
  }

  getAmiiboByFilter = (amiiboArray, fieldToTest, filterValue) => {
    return { amiibo: amiiboArray.amiibo.filter(amiibo => amiibo[fieldToTest] === filterValue) }
  }

  addAmiibo(amiibo){
    dataAmiibo.push(amiibo)
  }

  addType(type) {
    typeSet.add(type);
  }

  request(url, successCallback, errorCallback) {
    https.get(url, (res) => {
      if (res.statusCode > 399) {
        errorCallback();
        return;
      }

      if (res.statusCode === 308) {
        this.request(res.headers.location, successCallback, errorCallback);
        return;
      }

      res.setEncoding("utf8");

      let str = "";

      res.on("data", (data) => {
        str += data;
      });

      res.on("end", () => {
        const parseData = JSON.parse(str);

        parseData.amiibo.forEach((amiibo) => {
          dataAmiibo.push(amiibo);
          typeSet.add(amiibo.type);
          charactersSet.add(amiibo.character);
          amiiboSeriesSet.add(amiibo.amiiboSeries);
          gameSeriesSet.add(amiibo.gameSeries);
        });

        successCallback();
      });
    });
  }

  load(successCallback, errorCallback) {
    this.request(
      "https://www.amiiboapi.com/api/amiibo",
      successCallback,
      errorCallback
    );
  }
}

const dataImportES6 = new ES6();
export default dataImportES6;
