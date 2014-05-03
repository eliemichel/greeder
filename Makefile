# *** Replace these two vars if need to use another YUICOMPRESSOR than provided ***
YUICOMPRESSOR ?= yuicompressor
CLOSURE ?= closure

all: css/css.min.css js/js.min.js

css/css.min.css: css/styles.css css/knacss.css
	@echo "================================"
	@echo "[CSS] Starting minification"
	cat css/knacss.css css/styles.css > css/css.tmp.css
	$(YUICOMPRESSOR) -o css/css.min.css css/css.tmp.css
	rm css/css.tmp.css
	@echo "[CSS] Minification successful"
	@echo "================================"

js/js.min.js: js/script.js js/jquery.cookie.js js/jquery-2.1.1.js
	@echo "================================"
	@echo "[JS] Starting minification"
	# $(YUICOMPRESSOR) -o js/js.min.js js/js.tmp.js
	$(CLOSURE) --js js/jquery-2.1.1.js --js js/jquery.cookie.js --js js/script.js --create_source_map js/js.min.js.map --source_map_format=V3 --js_output_file js/js.min.js
	echo "//# sourceMappingURL=js/js.min.js.map" >> js/js.min.js
	@echo "[JS] Minification successful"
	@echo "================================"
