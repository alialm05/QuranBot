const axios = require('axios');


exports.getAudio = function(chId, rId, cb) {
    
  
    //console.log("hello");
  
    let config = {
      method: 'get',
    maxBodyLength: Infinity,
      url: `https://api.quran.com/api/v4/chapter_recitations/${rId}/${chId}`,
      headers: { 
        'Accept': 'application/json'
      }
    };
    
    axios(config)
    .then((response) => {
      //console.log(JSON.stringify(response.data));
      //console.log(response.data.audio_file.audio_url)
      return cb(response.data.audio_file, true);
    })
    .catch((error) => {
      console.log(error.response);
        return cb(error, false)
    });
    

}

exports.getReciters = function(lang, cb) {

  let config = {
    method: 'get',
  maxBodyLength: Infinity,
    url: 'https://api.quran.com/api/v4/resources/chapter_reciters',
    headers: { 
      'Accept': 'application/json'
    }
  };
  
  axios(config)
  .then((response) => {
    //console.log(JSON.stringify(response.data));
    //console.log(response.data.audio_file.audio_url)
    return cb(response.data.reciters, true);
  })
  .catch((error) => {
    console.log(error.response);
      return cb(error, false)
  });
  

}

exports.getChapters = function(lang, cb) {

  let config = {
    method: 'get',
  maxBodyLength: Infinity,
    url: `https://api.quran.com/api/v4/chapters?language=${lang}`,
    headers: { 
      'Accept': 'application/json'
    }
  };
  
  axios(config)
  .then((response) => {
    //console.log(JSON.stringify(response.data));
    //console.log(response.data.audio_file.audio_url)
    return cb(response.data.chapters, true);
  })
  .catch((error) => {
      console.log(error.response);
      return cb(error.response, false)
  });
}

exports.getChapter = function(r,cb) {

  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://api.quran.com/api/v4/chapters/${r}`,
    headers: { 
      'Accept': 'application/json'
    }
  };
  
  axios(config)
  .then((response) => {
    //console.log(JSON.stringify(response.data));
    return cb(response.data)
  })
  .catch((error) => {
    console.log(error);
    return cb(error);
  });
}

exports.getVerse = function(CVString, cb){

  let config = {
    method: 'get',
  maxBodyLength: Infinity,
    url: `https://api.quran.com/api/v4/verses/by_key/${CVString}?words=true`,
    headers: { 
      'Accept': 'application/json'
    }
  };
  
  axios(config)
  .then((response) => {
    //console.log(JSON.stringify(response.data));
    return cb(response.data, true)
  })
  .catch((error) => {
    console.log(error);
    return cb(error, false);
  });

}