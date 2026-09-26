CXX := g++
CXXFLAGS := -std=c++17 -Wall -Wextra -O2

PROGRAMS := stack linearqueue circularqueue linkedlist doublylinkedlist linearsearch binarysearch

all: $(PROGRAMS)

stack: stack.cpp
	$(CXX) $(CXXFLAGS) -o $@ $<

linearqueue: linearqueue.cpp
	$(CXX) $(CXXFLAGS) -o $@ $<

circularqueue: circularqueue.cpp
	$(CXX) $(CXXFLAGS) -o $@ $<

linkedlist: linkedlist.cpp
	$(CXX) $(CXXFLAGS) -o $@ $<

doublylinkedlist: doublylinkedlist.cpp
	$(CXX) $(CXXFLAGS) -o $@ $<

binarysearch: binarysearch.cpp
	$(CXX) $(CXXFLAGS) -o $@ $<

linearsearch: linearsearch.cpp
	$(CXX) $(CXXFLAGS) -o $@ $<

run-stack:
	./stack

run-linearqueue:
	./linearqueue

run-circularqueue:
	./circularqueue

run-linkedlist:
	./linkedlist

run-doublylinkedlist:
	./doublylinkedlist

run-binarysearch:
	./binarysearch

run-linearsearch:
	./linearsearch

clean:
	rm -f $(PROGRAMS)

.PHONY: all clean run-stack run-linearqueue run-circularqueue run-linkedlist run-doublylinkedlist run-linearsearch run-binarysearch
