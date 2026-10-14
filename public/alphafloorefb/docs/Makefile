.PHONY: all pdf html serve clean

all: pdf html

pdf:
	./build-pdf.sh ../user-guide.pdf

html:
	cd .. && mkdocs build

serve:
	cd .. && mkdocs serve

clean:
	rm -f ../user-guide.pdf
	rm -rf ../site
