var express = require('express'); 
var router = express.Router();


router.get('/', function (req, res){
    const {gte, lte} = req.query;
    
    if(gte && lte){
        req.bigcities.find({Population: {$gte: gte, $lte: lte}}).sort({Population: -1})
         .then(result =>{ // result is the mongoose object
            var docs = JSON.parse(JSON.stringify(result)); //docs is the js obj
            if (docs.length !=0){
                var obj = reconstruct(docs);
                res.status(200);
                res.json(obj);
            }
            else{
                var errMsg ={"error":"No record for this population range"};
                //res.setHeader('Content-Type', 'application/json'); if added, it will be json but json string
                res.status(404).send(JSON.stringify(errMsg));
            }   
            }).catch(err =>{
                var errMsg = {'error': err.message};
                res.status(500);
                res.send(JSON.stringify(errMsg));
            });
    }
    
    else if(gte){
        req.bigcities.find({Population: {$gte: gte}}).sort({Population: -1})
        .then(result =>{ // result is the mongoose object
           var docs = JSON.parse(JSON.stringify(result)); //docs is the js obj
           if (docs.length !=0){
               var obj = reconstruct(docs);
               res.status(200);
               res.json(obj);
           }
           else{
               var errMsg ={"error":"No record for this population range"};
               res.status(404).send(JSON.stringify(errMsg));
           }   
           }).catch(err =>{
               var errMsg = {'error': err.message};
               res.status(500);
               res.send(JSON.stringify(errMsg));
           });
    }

    else if(lte){
        req.bigcities.find({Population: {$lte: lte}}).sort({Population: -1})
        .then(result =>{ // result is the mongoose object
           var docs = JSON.parse(JSON.stringify(result)); //docs is the js obj
           if (docs.length !=0){
               var obj = reconstruct(docs);
               res.status(200);
               res.json(obj);
           }
           else{
               var errMsg ={"error":"No record for this population range"};
               res.status(404).send(JSON.stringify(errMsg));
           }   
           }).catch(err =>{
               var errMsg = {'error': err.message};
               res.status(500);
               res.send(JSON.stringify(errMsg));
           });
    }

    else{
        req.bigcities.find().sort({_id: 1})
        .then(result =>{ // result is the mongoose object
           var docs = JSON.parse(JSON.stringify(result)); //docs is the js obj
           if (docs.length !=0){
               var obj = reconstruct(docs);
               res.status(200);
               res.json(obj);
           }
           else{
               var errMsg ={"error":"No record for this population range"};
               res.status(404).send(JSON.stringify(errMsg));
           }   
           }).catch(err =>{
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




module.exports = router;