var app = require('../../../../app');
var should = require('should');
var META = require('../../metadata/index');
var assert = require('assert');
var models = require('../../../../bridge/models/sequelize');
var Board = models.Board;
var bbsGenderator = require("./flextures/board");

// 전체조건은 유저모델의 테스트이다.
// 즉 유저모델의 관한 테스트만 진행 되어야한다.
describe('[BBS Model Test]', function () {

    var boardFields;
    var board;

    describe('[Board test]', function () {

        describe('create invalid board', function () {

            before(function () {
                boardFields = bbsGenderator.getBoard();
                delete boardFields.slug;
            });

            it('should fail.', function (done) {
                Board.createBoardWithCategories(boardFields, function (status, data) {
                    // 서버단에서 막을수 있었던 코드 이기 때문에 501을 리턴해야한다.
                    status.should.be.exactly(501);
                    done();
                });
            });
        });

        describe('create valid board', function () {

            before(function () {
                boardFields = bbsGenderator.getBoard();
            });

            it('should success', function (done) {
                Board.createBoardWithCategories(boardFields, function (status, data) {
                    status.should.be.exactly(200);
                    data.should.have.property('slug', boardFields.slug);
                    board = data;
                    done();
                });
            });

            it('should update board', function (done) {
                boardFields = bbsGenderator.getBoard();
                boardFields.slug = 'modifySlug';
                delete boardFields.categories;

                Board.updateBoardBySlug(board.slug, boardFields, function(status, data) {
                    status.should.be.exactly(204);
                    board.slug = boardFields.slug;
                    done();
                });
            });

            it('should find board', function (done) {
                var roleUser = META.std.user.roleUser;
                Board.findBoardBySlug(roleUser, board.slug, null, function (status, data) {
                    status.should.be.exactly(200);
                    data.should.have.property('slug').which.is.exactly(board.slug);
                    Board.findBoardById(roleUser, board.id, null, function (status, data) {
                        status.should.be.exactly(200);
                        done();
                    });
                });
            });

            it('should remove board', function (done) {
                Board.destroyDataById(board.id, true, function (status, data) {
                    status.should.be.exactly(204);
                    done();
                });
            });
        });
    });
});
