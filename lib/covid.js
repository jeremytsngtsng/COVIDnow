const fetch = require('node-fetch');

async function getStat() {
  const data = await fetch('https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services/ncov_cases/FeatureServer/2/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=Confirmed%20desc&resultOffset=0&resultRecordCount=25&cacheHint=true');
  const byCity = (await data.json()).features;
  const data2 = await fetch('https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services/ncov_cases/FeatureServer/1/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&outStatistics=%5B%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22Confirmed%22%2C%22outStatisticFieldName%22%3A%22value%22%7D%5D&outSR=102100&cacheHint=true');
  const confirmedTotal = (await data2.json()).features[0].attributes.value;
  const data3 = await fetch('https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services/ncov_cases/FeatureServer/1/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&outStatistics=%5B%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22Deaths%22%2C%22outStatisticFieldName%22%3A%22value%22%7D%5D&outSR=102100&cacheHint=true');
  const deathTotal = (await data3.json()).features[0].attributes.value;
  const data4 = await fetch('https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services/ncov_cases/FeatureServer/1/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&outStatistics=%5B%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22Recovered%22%2C%22outStatisticFieldName%22%3A%22value%22%7D%5D&outSR=102100&cacheHint=true');
  const recoveredTotal = (await data4.json()).features[0].attributes.value;
  return {
    confirmedTotal,
    deathTotal,
    recoveredTotal,
    byCity,
  }
}

module.exports = async () => {
    const re = await getStat();
    let formatted = '';
    console.log('COVID19 Report (Countries)');
    console.log('Confirmed | Death | Recovered');
    re.byCity.forEach(c => {
      formatted += `\n${c.attributes.Country_Region}
${c.attributes.Confirmed} | ${c.attributes.Deaths || 0} | ${c.attributes.Recovered || 0}
`
      ;
    })
     console.log(formatted);
     console.log(`COVID19 Report\n
Confirmed: ${re.confirmedTotal}
Death: ${re.deathTotal}
Recovered: ${re.recoveredTotal}
Total Countries: ${re.byCity.length}`);
}