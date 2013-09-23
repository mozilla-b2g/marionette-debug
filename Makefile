TESTS?=$(shell find test -name *_test.js)
REPORTER?=spec
MOCHA_OPTS=--reporter $(REPORTER) \
			--ui tdd \
			--profile-base ./profile.js\
			$(TESTS)

.PHONY: default
default: lint test

b2g:
	./node_modules/.bin/mozilla-download --verbose --product b2g $@

.PHONY: lint
lint:
	gjslint --recurse . \
			--disable "220,225" \
			--exclude_directories "b2g,node_modules"

.PHONY: test-unit
test-unit:
	SYNC=true ./node_modules/.bin/marionette-mocha $(MOCHA_OPTS)

.PHONY: test
test: b2g test-unit
