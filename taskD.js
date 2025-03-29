var express = require('express'); 
var router = express.Router();


router.get('/:region?', function(req, res){
    const region = req.params.region;

    if(!region){
        req.bigcities.find({},{_id: 0, Timezone: 1}).sort({Timezone: 1})
         .then(result =>{
            var docs = JSON.parse(JSON.stringify(result));
            console.log(docs);
            var obj = getFormat(docs);
            res.status(200).json(obj);
         }
        ).catch(err =>{
            var errMsg = {'error': err.message};
            res.status(500);
            res.send(JSON.stringify(errMsg));
        });
    }
    else{
        req.bigcities.find({Timezone: { $regex: `^${region}/.*` }}, {_id: 0, 'ASCII Name': 1, 'ISO Alpha-2': 1, 'ISO Name EN': 1, Population: 1, Timezone: 1, Coordinates: 1}).sort({Population: -1})
        .then(result =>{
            var docs = JSON.parse(JSON.stringify(result));
            if(docs.length!=0){
                var obj =reconstruct(docs);
                res.status(200).json(obj);
            }
            else{
                var errMsg ={"error":"No record for this region"};
                res.status(404).send(JSON.stringify(errMsg));
            }
         }
        ).catch(err =>{
            var errMsg = {'error': err.message};
            res.status(500);
            res.send(JSON.stringify(errMsg));
        });
    }

})



function reconstruct(docs){
    for (i in docs){
        var doc = docs[i];
        const [x, y] = doc.Coordinates.split(',');
        var coords = {
            lat: parseFloat(x.trim()),
            lng: parseFloat(y.trim()),
        }
        delete doc.Coordinates;
        doc.Coordinates = coords;
    } 
    return docs;
}


function getFormat(docs){
    //distinct
    let temp = [];
    for(let i=0; i<docs.length; i++){
        var content = docs[i].Timezone.split('/')[0];
        temp.push(content);
    }

    const uniqueValues = new Set();
    const result = [];
  
    for (let obj of temp) {
  
      if (!uniqueValues.has(obj)) {
        uniqueValues.add(obj);
        result.push(obj);
      }
    }
    return result;
}

module.exports = router;