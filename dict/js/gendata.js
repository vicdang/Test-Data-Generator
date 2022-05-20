
/**
 * @class Jibborish generator.
 */
var GenData = function (lang) {
};

var readData = function(filePath, opt) {
    var fso = new ActiveXObject('Scripting.FileSystemObject');
    iStream=fso.OpenTextFile(filePath, 1, true, -2);
    if (opt==1){
        var data = {};
        while(!iStream.AtEndOfStream) {
            var line=iStream.ReadLine();
            data[line.split('=')[0]]=line.split('=')[1];
        };
    } else {
        var data = [];
        while(!iStream.AtEndOfStream) {
            var line=iStream.ReadLine();
            data.push(line);
        };
    };
    iStream.Close();
    return data;
};

/**
 * Average number of words per sentence.
 * @constant {number}
 */
GenData.WORDS_PER_SENTENCE_AVG = 24.460;

/**
 * Standard deviation of the number of words per sentence.
 * @constant {number}
 */
GenData.WORDS_PER_SENTENCE_STD = 5.080;

/**
 * List of possible words.
 * @constant {Array.string}
 */
GenData.WORDS = this.readData("./data/words.txt", 0);

/**
 * List of possible contries.
 * @constant {Array.string}
 */
GenData.COUNTRIES = this.readData("./data/countries.txt", 1);

/**
 * List of possible cities.
 * @constant {Array.string}
 */
GenData.CITIES = this.readData("./data/cities/US.txt", 0);

/**
 * List of possible female name.
 * @constant {Array.string}
 */
GenData.FEMALE_NAME = this.readData("./data/female_name.txt", 0);

/**
 * List of possible male name.
 * @constant {Array.string}
 */
GenData.MALE_NAME = this.readData("./data/male_name.txt", 0);

/**
 * List of possible cities.
 * @constant {Array.string}
 */
GenData.SUMNAME = this.readData("./data/sumname.txt", 0);

/**
 * List of possible cities.
 * @constant {Array.string}
 */
GenData.COUNTRIESACR = this.readData("./data/countriesacro.txt", 1);


/**
 * List of possible prefix.
 * @constant {Array.string}
 */
GenData.PREFIX = this.readData("./data/prefix.txt", 1);

 /**
 * List of possible Char set.
 * @constant {Array.string}
 */
GenData.CHAR_QUOTE = ["\"","'"];
GenData.CHAR_BRACKET = ["[","]","{","}","(",")","<",">"];
GenData.CHAR_SEPARATER = [",","-","_"," ",";",":"];
GenData.CHAR_EOP = [".","!","?"];
GenData.CHAR_SPECIAL = ["`","~","@","#","$","%","^","&","*","+","=","/","\\","|"];
GenData.CHAR_UTF = ["†","’","©","²","³","€","™","¯"];
GenData.CHARACTERS = GenData.CHAR_SPECIAL.concat(GenData.CHAR_QUOTE,GenData.CHAR_BRACKET,GenData.CHAR_SEPARATER,GenData.CHAR_EOP,GenData.CHAR_UTF);
GenData.ALPHABET = {
        'A':1,'B':2,'C':3,'D':4,'E':5,'F':6,'G':7,'H':8,'I':9,'J':10,'K':11,'L':12,'M':13,
        'N':14,'O':15,'P':16,'Q':17,'R':18,'S':19,'T':20,'U':21,'V':22,'W':23,'X':24,'Y':25,'Z':26
};

 /**
 * List of possible cities.
 * @constant {Array.string}
 */
GenData.VINDIGITPOSITIONMULTIPELR = [ 8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2 ];

/**
 * List of possible cities.
 * @constant {Array.string}
 */
GenData.VINDIGITVALUES = { 'A':1, 'B':2, 'C':3, 'D':4, 'E':5, 'F':6, 'G':7, 'H':8, 'J':1, 'K':2, 'L':3, 'M':4, 'N':5, 'P':7, 'R':9, 'S':2, 'T':3, 'U':4, 'V':5,'W':6, 'X':7, 'Y':8, 'Z':9, '1':1, '2':2, '3':3, '4':4, '5':5, '6':6, '7':7, '8':8, '9':9, '0':0};

/**
 * List of possible cities.
 * @constant {Array.string}
 */
GenData.PREFIXKEYS = (function(o){var ks=[]; for(var k in o) ks.push(k); return ks})(GenData.PREFIX);
GenData.VINDIGITVALUEKEYS = (function(o){var ks=[]; for(var k in o) ks.push(k); return ks})(GenData.VINDIGITVALUES);

/**
 * Generate "Lorem ipsum" style words.
 * @param num_words {number} Number of words to generate.
 * @return {string} "Lorem ipsum..."
 */
GenData.prototype.generateText = function (num_words) {
    var words, ii, position, word, current, sentences, sentence_length, sentence;
    /**
     * @default 100
     */
    num_words = num_words || 100;
    words = [GenData.WORDS[0], GenData.WORDS[1]];
    // num_words -= 2;
    for (ii = 0; ii < num_words; ii++) {
        position = Math.floor(Math.random() * GenData.WORDS.length);
        word = GenData.WORDS[position];
        if (ii > 0 && words[ii - 1] === word) {
            ii -= 1;
        } else {
            words[ii] = word;
        }
    }
    sentences = [];
    current = 0;
    
    while (num_words > 0) {
        sentence_length = this.getRandomSentenceLength();
        if (num_words - sentence_length < 4) {
            sentence_length = num_words;
        }
        num_words -= sentence_length;
        sentence = [];
        for (ii = current; ii < (current + sentence_length); ii++) {
            sentence.push(words[ii]);
        }
        sentence = this.punctuate(sentence);
        current += sentence_length;
        sentences.push(sentence.join(' '));
    }
    return sentences.join(' ');
};

/**
 * Insert commas and periods in the given sentence.
 * @param {Array.string} sentence List of words in the sentence.
 * @return {Array.string} Sentence with punctuation added.
 */
GenData.prototype.punctuate = function (sentence) {
    var word_length, num_commas, ii, position;
    word_length = sentence.length;
    /* End the sentence with a period. */
    // sentence[word_length - 1] += '.';
    if (word_length < 3) {
        return sentence;
    }
    sentence[word_length - 1] += this.generateCharSet(1, GenData.CHAR_EOP);
    num_commas = this.getRandomCommaCount(word_length);
    for (ii = 0; ii <= num_commas; ii++) {
        position = Math.round(ii * word_length / (num_commas + 1));
        
        if (position < (word_length - 1) && position > 0) {
            /* Add the comma. */
            // sentence[position] += ',';
            sentence[position] += this.generateCharSet(1, GenData.CHAR_SEPARATER);
        }
    }
    /* Capitalize the first word in the sentence. */
    sentence[0] = sentence[0].charAt(0).toUpperCase() + sentence[0].slice(1);
    return sentence;
};

/**
 * Produces a random number of commas.
 * @param {number} word_length Number of words in the sentence.
 * @return {number} Random number of commas
 */
GenData.prototype.getRandomCommaCount = function (word_length) {
    var base, average, standard_deviation;
    /* Arbitrary. */
    base = 6;
    average = Math.log(word_length) / Math.log(base);
    standard_deviation = average / base;
    return Math.round(this.gaussMS(average, standard_deviation));
};

/**
 * Produces a random sentence length based on the average word length
 * of an English sentence.
 * @return {number} Random sentence length
 */
GenData.prototype.getRandomSentenceLength = function () {
    return Math.round(
            this.gaussMS(
                    GenData.WORDS_PER_SENTENCE_AVG,
                    GenData.WORDS_PER_SENTENCE_STD
            )
    );
};

/**
 * Produces a random number.
 * @return {number} Random number
 */
GenData.prototype.gauss = function () {
    return (Math.random() * 2 - 1) +
            (Math.random() * 2 - 1) +
            (Math.random() * 2 - 1);
};

/**
 * Produces a random number with Gaussian distribution.
 * @param {number} mean
 * @param {number} standard_deviation
 * @return {number} Random number
 */
GenData.prototype.gaussMS = function (mean, standard_deviation) {
    return Math.round(this.gauss() * standard_deviation + mean);
};

/**
 * Generate "Lorem ipsum" style country.
 * @return {string} "Lorem ipsum..."
 */
GenData.prototype.generateCountry = function () {
    var key = this.sample(GenData.COUNTRIES);
    var value = GenData.COUNTRIES[key];
    return [key, value];
};

/**
 * Generate "Lorem ipsum" style cities.
 * @return {string} "Lorem ipsum..."
 */
GenData.prototype.generateCity = function (city) {
    try {
        var CITIES = this.readDataIn("./data/cities/"+city+".txt", 0);
    } catch(err) {
        var CITIES = [err.message +" "+ city+".txt"];
    };
    return this.sample(CITIES);
};

/**
 * Generate "Lorem ipsum" style female name.
 * @return {string} "Lorem ipsum..."
 */
GenData.prototype.generateFemaleName = function () {
    return this.sample(GenData.FEMALE_NAME);
};

/**
 * Generate "Lorem ipsum" style male name.
 * @return {string} "Lorem ipsum..."
 */
GenData.prototype.generateMaleName = function () {
    return this.sample(GenData.MALE_NAME);
};

/**
 * Generate "Lorem ipsum" style male name.
 * @return {string} "Lorem ipsum..."
 */
GenData.prototype.generateSumName = function () {
    return this.sample(GenData.SUMNAME);
};

/**
 * Generate "Lorem ipsum" style phone number.
 * @return {string} "Lorem ipsum..."
 */
GenData.prototype.generatePhoneNumber = function () {
    phonenum="";
    numdi = Math.floor((Math.random() * 2) + 10);
    for (ii = 0; ii < numdi; ii++) {
        num = Math.floor((Math.random() * 10));
        phonenum += num;
    }
    return phonenum.replace(/(\d{3})(\d{4})(\d{3,4})/, '$1 $2 $3');
};

/**
 * Generate "Lorem ipsum" style country dial.
 * @return {string} "Lorem ipsum..."
 */
GenData.prototype.generateDialCode = function () {
    dialnum = Math.floor((Math.random() * 999) + 1);
    return dialnum;
};

/**
 * Generate "Lorem ipsum" style country dial.
 * @return {string} "Lorem ipsum..."
 */
GenData.prototype.generateCoutryAcro = function () {
    return this.sample(GenData.COUNTRIESACR);
};

/**
 * Generate "Lorem ipsum" style Charset.
 * @return {string} "Lorem ipsum..."
 */
GenData.prototype.generateCharSet = function (len, charset) {
    if(!charset){
        charset = GenData.CHARACTERS;
    };
    var strChars = "";
    var strTmp;
    for (var i = 0; i < len; i++) {
        position = Math.floor(Math.random() * charset.length);
        strTmp = charset[position];
        strChars += strTmp;
    };
    return strChars;
};


/**
 * Generate "Lorem ipsum" style Date.
 * @return {string} "Lorem ipsum..."
 */
GenData.prototype.generateDate = function (mindate, maxdate) {
    function getRandomArbitrary(min, max) {
      return Math.random() * (max - min) + min;
    }
    var mindate = mindate || '01-01-1970';
    var maxdate = maxdate || new Date().toLocaleDateString();
    mindate = new Date(mindate).getTime();
    maxdate = new Date(maxdate).getTime();
    if( mindate>maxdate){
        var genvalue = new Date(getRandomArbitrary(maxdate,mindate));
    } else{
        var genvalue = new Date(getRandomArbitrary(mindate, maxdate));
    }
    return genvalue;
};

/**
 * Generate "Lorem ipsum" style LicensePlate.
 * @return {string} "Lorem ipsum..."
 */
GenData.prototype.generateLicensePlate = function (mindate, maxdate) {
    var provnum = this.checkTime(this.generateNumber(1,99));
    var alpha = this.sample(GenData.ALPHABET);
    var state = this.generateNumber(1,9);
    var style = this.generateNumber(4,5);
    var num = "";
    if (style==5) {
        for (var i = 0; i < 3; i++) {
            num += this.generateNumber(0,9);
        }
        num += "."
        for (var i = 0; i < 2; i++) {
            num += this.generateNumber(0,9);
        }
    } else {
        for (var i = 0; i < 4; i++) {
            num += this.generateNumber(0,9);
        }
    }
    var value = provnum + "-" + alpha + state + " " + num;
    return value;
};

/**
 * Generate "Lorem ipsum" style LicensePlate.
 * @return {string} "Lorem ipsum..."
 */
GenData.prototype.generateNumber = function (min, max) {
    return value = Math.floor(Math.random() * (max-min+1)) + min;
};

/**
 * Generate "Lorem ipsum" style VIN.
 * @return {string} "Lorem ipsum..."
 */
GenData.prototype.generateVin = function () {
    var prefix = GenData.PREFIXKEYS[Math.floor(Math.random() * GenData.PREFIXKEYS.length)];
    var code = GenData.PREFIX[prefix];
    var char = GenData.VINDIGITVALUEKEYS[Math.floor(Math.random() * GenData.VINDIGITVALUEKEYS.length)];
    var chars = '';
    for (var i = 0; i < 7; i++) {
        chars += this.sample(GenData.VINDIGITVALUEKEYS);
    };
    // var chars = this.times(7,this.partial(this.sample,GenData.VINDIGITVALUEKEYS)).join('');
    var vinPart = prefix + char + code + chars;
    var check = this.getCheckSum(vinPart);
    return vinPart.substring(0,8) + check + vinPart.substring(9,17);
};

/**
 * Generate "Lorem ipsum" style checksum VIN.
 * @return {string} "Lorem ipsum..."
 */
GenData.prototype.getCheckSum = function (vin) {
    var checkSumTotal = 0,
        remainder;
    if (vin.length < 17) {
        return 'Invalid VIN Length: ' + vin.length;
    }
    var vin = vin.split('');
    for (var i = 0; i < vin.length; i++) {
        char = vin[i];
        if (GenData.VINDIGITVALUES[char] !== undefined) {
            checkSumTotal += GenData.VINDIGITVALUES[char] * GenData.VINDIGITPOSITIONMULTIPELR[i];
        } else {
            return 'Illegal Character: ' + char;
        };
    }
    remainder = checkSumTotal % 11;
    if (remainder === 10) {
        return 'X';
    }
    return remainder;
};

/**
 * Generate "Lorem ipsum" style get keys.
 * @return {string} "Lorem ipsum..."
 */
GenData.prototype.getKeys = function(o){
    var ks=[];
    for(var k in o) {
        ks.push(k);
    };
    return ks
};

/**
 * Generate "Lorem ipsum" style partials.
 * @return {string} "Lorem ipsum..."
 */
GenData.prototype.sample = function(inarr){
    // alert(inarr instanceof Array)
    if(inarr instanceof Array){
        position = Math.floor(Math.random() * inarr.length);
        return value = inarr[position];
    } else {
        var keys = Object.keys(inarr);
        return this.sample(keys);
    }
};

/**
 * Generate "Lorem ipsum" style partials.
 * @return {string} "Lorem ipsum..."
 */
GenData.prototype.times = function(intimes, infunc){
    var result = [];
    for (var i = 0; i < intimes; i++) {
        result.push(GenData[infunc]());
    };
    return result;
};

/**
 * Generate "Lorem ipsum" style partials.
 * @return {string} "Lorem ipsum..."
 */
GenData.prototype.partial = function(infunc, inval){
    return GenData[infunc](inval);
};

/**
 * Generate "Lorem ipsum" style Object keys.
 * @return {string} "Lorem ipsum..."
 */
Object.keys = Object.keys || function keys(obj) {
  var ret = [];
  for (var prop in obj) if (obj.hasOwnProperty(prop)) ret.push(prop)
  return ret;
}

/**
 * Generate "Lorem ipsum" style Object keys.
 * @return {string} "Lorem ipsum..."
 */
GenData.prototype.checkTime = function(i) {
    return (i<10?"0"+i:i);
};

/**
 * Generate "Lorem ipsum" style Object keys.
 * @return {string} "Lorem ipsum..."
 */
GenData.prototype.readDataIn = function(filePath, opt) {
    var fso = new ActiveXObject('Scripting.FileSystemObject'),
    iStream=fso.OpenTextFile(filePath, 1, false, -2);
    if (opt==1){
        var data = {};
        while(!iStream.AtEndOfStream) {
            var line=iStream.ReadLine();
            data[line.split('=')[0]]=line.split('=')[1];
        }
    } else {
        var data = [];
        while(!iStream.AtEndOfStream) {
            var line=iStream.ReadLine();
            data.push(line);
        }
    }
    iStream.Close();
    return data;
}