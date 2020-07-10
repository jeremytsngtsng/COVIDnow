const fetch = require('node-fetch');
const emojis = require('node-emoji');
const colors = require('colors');
const Table = require('cli-table3');
const chalk = require('chalk')


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
    const table = new Table({
      chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
             , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
             , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
             , 'right': '║' , 'right-mid': '╢' , 'middle': '│' },
      head: [`${emojis.get('earth_americas')} Country`, `${emojis.get('hospital')} Confirmed`, `${emojis.get('skull')} Deaths`, `${emojis.get('relieved')} Recovered`],
      colWidths: [30, 30, 30, 30]
    });
    table.push(
      [`${colors.rainbow('Total Countries')}: ${chalk.bold(re.byCity.length)}`, `${chalk.bold(`${re.confirmedTotal}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','))}`, `${chalk.bold(`${re.deathTotal}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','))}`, `${chalk.bold(`${re.recoveredTotal}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','))}`]
    )
    re.byCity.forEach(c => {
    table.push(
      [`${c.attributes.Country_Region}`, `${`${c.attributes.Confirmed}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`, `${`${c.attributes.Deaths || 0}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`, `${`${c.attributes.Recovered || 0}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`]
    );})
    console.log(`
      _____ ______      _______ _____                      
     / ____/ __ \\ \\    / /_   _|  __ \\                     
    | |   | |  | \\ \\  / /  | | | |  | |_ __   _____      __
    | |   | |  | |\\ \\/ /   | | | |  | | '_ \\ / _ \\ \\ /\\ / /
    | |___| |__| | \\  /   _| |_| |__| | | | | (_) \\ V  V / 
     \\_____\\____/   \\/   |_____|_____/|_| |_|\\___/ \\_/\\_/  
`
    );
    console.log(table.toString());
}