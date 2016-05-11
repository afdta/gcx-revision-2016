feed <- read.csv("~/Projects/Brookings/metro-innovations/feed/2016_04_14.csv", stringsAsFactors=FALSE)

feed$dt <- strptime(feed$date, format="%m/%d/%Y")

feed2 <- feed[feed$type=="Plan", c("notes", "dt", "description", "link")]

feed2 <- feed2[order(feed2$dt, decreasing=TRUE), ]
