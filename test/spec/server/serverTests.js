(function () {
  'use strict';

  var chai = require('chai')
    , chaiHttp = require('chai-http')
    , settings = require('../../../server/settings.json');

  chai.use(chaiHttp);

  describe('Server', function () {

    var server;
    beforeEach(function () {
      delete require.cache[require.resolve('../../../server/server')];
      server = require('../../../server/server');
    });

    afterEach(function (done) {
      server.close(done);
    });    

    describe('POST /common/log', function () {
      
      it('should add log record', function () {      	

        chai.request( "http://localhost:" + settings.portListen)
            .post("/common/log")
            .send(
              {
                IsError: false,
                Browser: "Chrome",
                Error: "info"
              }
            ).then(function (res) {
               expect(res).to.have.status(200);
            })
            .catch(function (err) {
               throw err;
            });

      });

    });

    describe('POST /common/queries', function () {
      
      it('should log query', function () {       

        chai.request( "http://localhost:" + settings.portListen)
            .post("/common/queries")
            .send(
              {
                session: '3bce4931-6c75-41ab-afe0-2ec108a30860',
                query: "c#, java, c++"
              }
            ).then(function (res) {
               expect(res).to.have.status(200);
            })
            .catch(function (err) {
               throw err;
            });

      });

    });    

    describe('GET /dictionary/suggestion', function () {
      
      it('should return array of suggestions', function () {       

        chai.request( "http://localhost:" + settings.portListen)
            .get("/dictionary/suggestion")
            .then(function (res) {
              expect(res).to.exists;
              expect(res).to.not.be.empty;
              expect(res).to.have.status(200);
            })
            .catch(function (err) {
               throw err;
            });

      });

    });    

    describe('GET /dictionary/cloudTags', function () {
      
      it('should return array of tags', function () {       

        chai.request( "http://localhost:" + settings.portListen)
            .get("/dictionary/cloudTags")
            .then(function (res) {
              expect(res).to.exists;
              expect(res).to.not.be.empty;
              expect(res).to.have.status(200);
            })
            .catch(function (err) {
               throw err;
            });

      });

    });    


  });
})();
