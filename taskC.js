var express = require('express'); 
var router = express.Router();


router.get('/:code?', function (req,res){
    const code = req.params.code;

    if (code){
        req.bigcities.find({'ISO Alpha-2': code}, {_id: 0, 'ASCII Name': 1, Population: 1, Timezone: 1, Coordinates:1}).sort({Population:-1})
         .then(result =>{
            var docs = JSON.parse(JSON.stringify(result));
            if(docs.length!=0){
                var obj =reconstruct(docs);
                res.status(200).json(obj);
            }
            else{
                var errMsg ={"error":"No record for this alpha code"};
                res.status(404).send(JSON.stringify(errMsg));
            }
         }
        ).catch(err =>{
            var errMsg = {'error': err.message};
            res.status(500);
            res.send(JSON.stringify(errMsg));
        });
    }
    else{
        req.bigcities.find({},{"ISO Alpha-2":1, "ISO Name EN":1, _id: 0})//?? can directly .sort()
         .then(result =>{
            var docs = JSON.parse(JSON.stringify(result));
            var obj = getFormat(docs,"ISO Alpha-2");
            res.status(200).json(obj);
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



function getFormat(docs, name){
    //distinct
    const uniqueValues = new Set();
    const result = [];
  
    for (let obj of docs) {
      const fieldValue = obj[name];
  
      if (!uniqueValues.has(fieldValue)) {
        uniqueValues.add(fieldValue);
        result.push(obj);
      }
    }

    var sortable = [];
    for (let i=0; i<result.length; i++){
        sortable.push({
            'code': result[i]['ISO Alpha-2'],
            'name': result[i]['ISO Name EN']
        })
    }

    sortable.sort(function(a, b) {
        return a.code.localeCompare(b.code);
    })
    return sortable;

  } 







module.exports = router;