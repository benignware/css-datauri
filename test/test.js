var
	CSSDataURI = require('../lib/css-datauri'),
	cssDataURISync = require('../lib/css-datauri').sync,
	cssDataURIPromise = require('../lib/css-datauri').promise,
	assert = require('assert'),
	fs = require('fs'),
	exec = require('child_process').exec;

describe('css-datauri', function() {

  it('should work asynchronously', function(done) {
	(new CSSDataURI()).encode('test/fixtures/test.css', 'tmp/default_options', (err, data) => {
	    assert.equal(fs.readFileSync('tmp/default_options', 'utf8'), fs.readFileSync('test/expected/default_options', 'utf8'));
    	done();
	});
  });
  
  it('should work asynchronously with events', function(done) {
	(new CSSDataURI())
		.on('success', (content) => {
			assert.equal(fs.readFileSync('tmp/default_options', 'utf8'), fs.readFileSync('test/expected/default_options', 'utf8'));
	    	done();
		})
		.on('error', err => { throw(err); })
		.encode('test/fixtures/test.css', 'tmp/default_options');
  });
  
  it('should work asynchronously with promise', function(done) {
	cssDataURIPromise('test/fixtures/test.css', 'tmp/default_options')
	.then(() => {
		assert.equal(fs.readFileSync('tmp/default_options', 'utf8'), fs.readFileSync('test/expected/default_options', 'utf8'));
    	done();
	}).catch(err => { throw(err); });
  });
  
  it('should work synchronously', function() {
	cssDataURISync('test/fixtures/test.css', 'tmp/default_options');
    assert.equal(fs.readFileSync('tmp/default_options', 'utf8'), fs.readFileSync('test/expected/default_options', 'utf8'));
  });
  
  it('should work asynchronously with custom options', function(done) {
	(new CSSDataURI({
	    filter: ['test/fixtures/fonts/**/*']
	})).encode('test/fixtures/test.css', 'tmp/custom_options', (err, data) => {
	    // Done
	    assert.equal(fs.readFileSync('tmp/custom_options', 'utf8'), fs.readFileSync('test/expected/custom_options', 'utf8'));
	    done();
	});
  });
  
  it('should work synchronously with custom options', function() {
	cssDataURISync('test/fixtures/test.css', 'tmp/custom_options', {
	    filter: ['test/fixtures/fonts/**/*']
	});
	assert.equal(fs.readFileSync('tmp/custom_options', 'utf8'), fs.readFileSync('test/expected/custom_options', 'utf8'));
  });
  
  it('should work on the command line', function(done) {
	exec("node . test/fixtures/test.css tmp/default_options", function(error, stdout, stderr) {
	    assert.equal(fs.readFileSync('tmp/default_options', 'utf8'), fs.readFileSync('test/expected/default_options', 'utf8'));
	   	done();
	});
  });
  
  it('should work on the command line with custom options', function(done) {
	exec("node . test/fixtures/test.css tmp/custom_options -f 'test/fixtures/fonts/**/*'", function(error, stdout, stderr) {
	    assert.equal(fs.readFileSync('tmp/custom_options', 'utf8'), fs.readFileSync('test/expected/custom_options', 'utf8'));
	   	done();
	});
  });
  
});