describe('VCF', function () {
    "use strict";

    describe('parseDate', function () {
        // [pattern, given, expectedYear, expectedMonth, expectedDate]
        var datePatternExpectations = [
            ['yyyymmdd', '19870417', 1987, 3, 17],
            ['yyyy-mm', '1987-04', 1987, 3, 1],
            ['yyyy', '1987', 1987, 0, 1],
            ['--mmdd', '--0417', 1970, 3, 17],
            ['---dd', '---17', 1970, 0, 17]
        ];

        itParsesPatterns();

        function itParsesPatterns() {
            datePatternExpectations.forEach(function (item) {
                it('parses the date with pattern ' + item[0], function () {
                    var date = VCF.parseDate(item[1]);
                    expect(date.getUTCFullYear()).toBe(item[2]);
                    expect(date.getUTCMonth()).toBe(item[3]);
                    expect(date.getUTCDate()).toBe(item[4]);
                });
            });
        }
    });

    describe('parseTime', function () {
        // [pattern, given, expectedHours, expectedMinutes, expectedSeconds]
        var timePatternExpectations = [
            ['HHmmss', '235930', 23, 59, 30],
            ['HHmmssZ', '235930Z', 23, 59, 30],
            ['HHmmss+NN', '215930+02', 23, 59, 30],
            ['HHmmss+NNNN', '162930+0730', 23, 59, 30],
            ['HHmmss-NN', '015930-02', 23, 59, 30],
            ['HHmmss-NNNN', '012930-0130', 23, 59, 30],
            ['HHmm', '2359', 23, 59, 0],
            ['HH', '23', 23, 0, 0],
            ['--mmss', '--5930', 0, 59, 30],
            ['--ss', '---30', 0, 0, 30]
        ];

        itParsesPatterns();

        function itParsesPatterns() {
            timePatternExpectations.forEach(function (item) {
                it('parses the time with pattern ' + item[0], function () {
                    var date = VCF.parseTime(item[1]);
                    expect(date.getUTCHours()).toBe(item[2]);
                    expect(date.getUTCMinutes()).toBe(item[3]);
                    expect(date.getUTCSeconds()).toBe(item[4]);
                });
            });
        }
    });

    describe('parseTimeDate', function () {
        // [pattern, given, expectedYear, expectedMonth, expectedDay, expectedHours, expectedMinutes, expectedSeconds]
        var timePatternExpectations = [
            ['YYYYMMDDTHHmmss', '19870417T172345', 1987, 3, 17, 17, 23, 45],
            ['--MMDDTHHmm', '--0417T1723', 1970, 3, 17, 17, 23, 0],
            ['---DDTHH', '---17T14', 1970, 0, 17, 14, 0, 0]
        ];

        itParsesPatterns();

        function itParsesPatterns() {
            timePatternExpectations.forEach(function (item) {
                it('parses the timeDate with pattern ' + item[0], function () {
                    var datetime = VCF.parseDateTime(item[1]);
                    expect(datetime.getUTCFullYear()).toBe(item[2]);
                    expect(datetime.getUTCMonth()).toBe(item[3]);
                    expect(datetime.getUTCDate()).toBe(item[4]);
                    expect(datetime.getUTCHours()).toBe(item[5]);
                    expect(datetime.getUTCMinutes()).toBe(item[6]);
                    expect(datetime.getUTCSeconds()).toBe(item[7]);
                });
            });
        }
    });

    describe('parseDateAndOrTime', function () {
        describe('parse a time only', function () {
            // [pattern, given, expectedHours, expectedMinutes, expectedSeconds]
            var timeOnlyPatternExpectations = [
                ['THHmmss', 'T235930', 23, 59, 30],
                ['THHmmssZ', 'T235930Z', 23, 59, 30],
                ['THHmmss+NN', 'T215930+02', 23, 59, 30],
                ['THHmmss+NNNN', 'T162930+0730', 23, 59, 30],
                ['THHmmss-NN', 'T015930-02', 23, 59, 30],
                ['THHmmss-NNNN', 'T012930-0130', 23, 59, 30],
                ['THHmm', 'T2359', 23, 59, 0],
                ['THH', 'T23', 23, 0, 0],
                ['T--mmss', 'T--5930', 0, 59, 30],
                ['T--ss', 'T---30', 0, 0, 30]
            ];

            itParsesPatterns();

            function itParsesPatterns() {
                timeOnlyPatternExpectations.forEach(function (item) {
                    it('parses the time with pattern ' + item[0], function () {
                        var date = VCF.parseDateAndOrTime(item[1]);
                        expect(date.getUTCHours()).toBe(item[2]);
                        expect(date.getUTCMinutes()).toBe(item[3]);
                        expect(date.getUTCSeconds()).toBe(item[4]);
                    });
                });
            }
        });
        describe('parse a date only', function () {
            // [pattern, given, expectedYear, expectedMonth, expectedDay, expectedHours, expectedMinutes,
            // expectedSeconds]
            var dateOnlyPatternExpectations = [
                ['YYYYMMDDTHHmmss', '19870417T172345', 1987, 3, 17, 17, 23, 45],
                ['--MMDDTHHmm', '--0417T1723', 1970, 3, 17, 17, 23, 0],
                ['---DDTHH', '---17T14', 1970, 0, 17, 14, 0, 0],
                ['YYYY', '1987', 1987, 0, 1, 0, 0, 0]
            ];

            itParsesPatterns();

            function itParsesPatterns() {
                dateOnlyPatternExpectations.forEach(function (item) {
                    it('parses the timeDate with pattern ' + item[0], function () {
                        var datetime = VCF.parseDateAndOrTime(item[1]);
                        expect(datetime.getUTCFullYear()).toBe(item[2]);
                        expect(datetime.getUTCMonth()).toBe(item[3]);
                        expect(datetime.getUTCDate()).toBe(item[4]);
                        expect(datetime.getUTCHours()).toBe(item[5]);
                        expect(datetime.getUTCMinutes()).toBe(item[6]);
                        expect(datetime.getUTCSeconds()).toBe(item[7]);
                    });
                });
            }
        });
    });

    describe('lex', function () {
        it('parses a minimal VCARD', function () {
            var vcard =
                "BEGIN:VCARD\r\n" +
                "VERSION:4.0\r\n" +
                "END:VCARD";

            var testTokens = jasmine.createSpy('testTokens');

            VCF.lex(vcard, testTokens);

            expect(testTokens).toHaveBeenCalledTimes(3);
            expect(testTokens).toHaveBeenCalledWith('BEGIN', 'VCARD', {});
            expect(testTokens).toHaveBeenCalledWith('VERSION', '4.0', {});
            expect(testTokens).toHaveBeenCalledWith('END', 'VCARD', {});
        });

        it('parses a VCARD with a multiline member', function () {
            var vcard =
                "BEGIN:VCARD\r\n" +
                "VERSION:4.0\r\n" +
                "FN:I am a long name, that is broken in\r\n" +
                " to more than just a single line\r\n" +
                "\t to be exact three.\r\n" +
                "END:VCARD";

            var testTokens = jasmine.createSpy('testTokens');

            VCF.lex(vcard, testTokens);

            expect(testTokens).toHaveBeenCalledTimes(4);
            expect(testTokens).toHaveBeenCalledWith('FN', "I am a long name, that is broken into more than just a single line to be exact three.", {});
        });
    });

    describe('parse', function () {
        it('parses a vcard', function () {
            var vcard =
                "BEGIN:VCARD\r\n" +
                "END:VCARD\r\n";

            VCF.parse(vcard, testVCardInstance);

            function testVCardInstance(vc) {
                expect(vc instanceof VCard).toBeTruthy();
            }
        });

        it('recognize two vCards', function () {
            var vcard =
                "BEGIN:VCARD\r\n" +
                "END:VCARD\r\n" +
                "BEGIN:VCARD\r\n" +
                "END:VCARD\r\n";

            var testVCard = jasmine.createSpy('testVCard');

            VCF.parse(vcard, testVCardInstance);

            function testVCardInstance(vc) {
                expect(vc instanceof VCard).toBeTruthy();
            }
        });

        it('parses the FN Attribute', function () {
            var vcard =
                "BEGIN:VCARD\r\n" +
                "VERSION:4.0\r\n" +
                "FN:My formatted name\r\n" +
                "END:VCARD\r\n";

            var testVCard = jasmine.createSpy('testVCard');

            VCF.parse(vcard, testVCardInstance);

            function testVCardInstance(vc) {
                expect(vc.fn).toBe('My formatted name');
            }
        });

        it('parses a three-part name', function () {
            var vcard =
                "BEGIN:VCARD\r\n" +
                "VERSION:4.0\r\n" +
                "N:Lessing;Gotthold;Ephraim;;\r\n" +
                "END:VCARD\r\n";

            var testVCard = jasmine.createSpy('testVCard');

            VCF.parse(vcard, testVCardInstance);

            function testVCardInstance(vc) {
                expect(vc.n['family-name'][0]).toBe('Lessing');
                expect(vc.n['given-name'][0]).toBe('Gotthold');
                expect(vc.n['additional-name'][0]).toBe('Ephraim');
            }
        });

        it('parses a three-part name, when protoype of Array is augmented', function () {
            Array.prototype.foo = function () { };
            var vcard =
                "BEGIN:VCARD\r\n" +
                "VERSION:4.0\r\n" +
                "N:Lessing;Gotthold;Ephraim;;\r\n" +
                "END:VCARD\r\n";

            var testVCard = jasmine.createSpy('testVCard');

            VCF.parse(vcard, testVCardInstance);

            function testVCardInstance(vc) {
                expect(vc.n['family-name'][0]).toBe('Lessing');
                expect(vc.n['given-name'][0]).toBe('Gotthold');
                expect(vc.n['additional-name'][0]).toBe('Ephraim');

                //foo is set to undefined so other tests would fail as well.
                //keep it in here for documentation
                delete Array.prototype.foo;
            }
        });

        it('parses a complex name with all parts and multiple values per part is set', function () {
            var vcard =
                "BEGIN:VCARD\r\n" +
                "VERSION:4.0\r\n" +
                "N:Lessing;Gotthold;Ephraim,Soundso;Dr.,Prof.;von und zu hier und da\r\n" +
                "END:VCARD\r\n";

            VCF.parse(vcard, testVCardInstance);

            function testVCardInstance(vc) {
                expect(vc.n['family-name'][0]).toBe('Lessing');
                expect(vc.n['given-name'][0]).toBe('Gotthold');
                expect(vc.n['additional-name'][0]).toBe('Ephraim');
                expect(vc.n['additional-name'][1]).toBe('Soundso');
                expect(vc.n['honorific-prefix'][0]).toBe('Dr.');
                expect(vc.n['honorific-prefix'][1]).toBe('Prof.');
                expect(vc.n['honorific-suffix'][0]).toBe('von und zu hier und da');
            }
        });

        it('recognizes nicknames', function () {
            var vcard =
                "BEGIN:VCARD\r\n" +
                "VERSION:4.0\r\n" +
                "NICKNAME:foo,bar,baz\r\n" +
                "END:VCARD\r\n";

            VCF.parse(vcard, testVCardInstance);

            function testVCardInstance(vc) {
                expect(vc.nickname[0]).toBe('foo');
                expect(vc.nickname[1]).toBe('bar');
                expect(vc.nickname[2]).toBe('baz');
            }
        });

        it('recognizes birthday', function () {
            var vcard =
                "BEGIN:VCARD\r\n" +
                "VERSION:4.0\r\n" +
                "BDAY:--0417\r\n" +
                "END:VCARD";

            VCF.parse(vcard, testVCardInstance);

            function testVCardInstance(vc) {
                expect(vc.bday.getUTCDate()).toBe(17);
                expect(vc.bday.getUTCMonth()).toBe(3);
            }
        });

        it('decodes printable-quoted strings quoted in UTF-8 correctly', function () {
            var vcard =
                "BEGIN:VCARD\r\n" +
                "VERSION:4.0\r\n" +
                "N;CHARSET=UTF-8;ENCODING=QUOTED-PRINTABLE:=45=62=65=72=68=61=72=64=74;=42=6A=C3=B6=72=6E;;;\r\n" +
                "END:VCARD";

            VCF.parse(vcard, function (vc) {
                expect(vc.n['given-name'][0]).toBe("Björn");
            });
        });

        testGender('male without identity', 'M', {sex: 'male'});
        testGender("female without identity", "F", {sex:'female'});
        testGender("female with identity", "F;boy", {sex:'female',identity:'boy'});
        testGender("other without identity", "O", {sex:'other'});
        testGender("none without identity", "N", {});

        function testGender(message, genderValue, expectedGender) {
            it('recognizes ' + message, function () {
                var vcard =
                    "BEGIN:VCARD\r\n" +
                    "VERSION:4.0\r\n" +
                    "GENDER:" + genderValue + "\r\n" +
                    "END:VCARD";

                var testVCard = jasmine.createSpy('testVCard');

                VCF.parse(vcard, testSex);

                function testSex(vc) {
                    expect(vc.gender.sex).toBe(expectedGender.sex);
                    expect(vc.gender.identity).toBe(expectedGender.identity);
                }
            });
        }
    });
});

