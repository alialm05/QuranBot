const path = require('path')
const quranApi = require('../QuranApi')
const fs = require('fs')
const { LOADIPHLPAPI } = require('dns')
const { Console } = require('console')
const writeToFile = '../Surahs.txt'

const surahsTextFile = path.join(__dirname,'Surahs') + '.txt'
const config = require('../config')
const { stringify } = require('querystring')
/*fs.readFile('./Surahs.txt', 'utf8', (err, data) => {
    console.log(typeof(data))
    const surahs = data.split('\n')
    for (var i =0; i <surahs.length; i++){
        //console.log(surahs[i])
        const surahName = surahs[i].split(':')[0] 
        const surahNum = surahs[i].split(':')[1]

        console.log(surahName, surahNum)
        break
    }
})*/

quranApi.getChapters('en', function(r, success){
    //console.log(`${JSON.stringify(r)}`);
    
    //url = r;
    if (success) {
        
        let allSURAHS = []
        
        for (var i=0; i< r.length; i++) {
                let c = `["${r[i].name_simple}", "${r[i].name_arabic}"], \n`
                //allSURAHS[r[i].id] = c
                fs.appendFileSync(surahsTextFile, c, (err) => {if (err) console.log(err)})
                //console.log(c);
                //fs.writeFile(surahsTextFile, c, (err) => {if (err) console.log(err)})
                //console.log(r[i].name_simple)
                //break;
        }
        //console.log(allSURAHS);
    }
    }
)