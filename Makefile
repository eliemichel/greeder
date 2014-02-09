# *** Replace these two vars if need to use another YUICOMPRESSOR than provided ***
YUICOMPRESSOR ?= java -jar yuicompressor-2.4.8.jar

all: css/css.min.css js/js.min.js

css/css.min.css: css/styles.css css/knacss.css
	@echo "================================"
	@echo "[CSS] Starting minification"
	cat css/styles.css css/knacss.css > css/css.tmp.css
	$(YUICOMPRESSOR) -o css/css.min.css css/css.tmp.css
	rm css/css.tmp.css
	@echo "[CSS] Minification successful"
	@echo "================================"

js/js.min.js: js/script.js js/jquery.cookie.min.js js/jquery-2.0.3.min.js
	@echo "================================"
	@echo "[JS] Starting minification"
	cat js/jquery-2.0.3.min.js js/jquery.cookie.min.js js/script.js > js/js.tmp.js
	$(YUICOMPRESSOR) -o js/js.min.js js/js.tmp.js
	rm js/js.tmp.js
	@echo "[JS] Minification successful"
	@echo "================================"
