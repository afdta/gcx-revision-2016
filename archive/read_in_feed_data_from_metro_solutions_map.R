feed <- read.csv("~/Projects/Brookings/metro-innovations/feed/2016_04_14.csv", stringsAsFactors=FALSE)

feed$dt <- strptime(feed$date, format="%m/%d/%Y")

feed2 <- feed[gsub("\\s", "", feed$type)=="Plan", c("notes", "dt", "description", "link")]

feed2 <- feed2[order(feed2$dt, decreasing=TRUE), ]


#compare gcx data

old <- read.csv("~/Projects/Brookings/gcx/GCXPlans_8Mar2015.csv", stringsAsFactors=FALSE)
new <- read.csv("~/Projects/Brookings/gcx/GCXPlans_11May2016.csv", stringsAsFactors=FALSE)

all.equal(old, new)

emis <- old$Export_Plan != new$Export_Plan
fmis <- old$Global_Trade_and_Investment_Plan != new$Global_Trade_and_Investment_Plan

mismatches <- data.frame(oexp=old[emis, "Export_Plan"], 
                         nexp=new[emis, "Export_Plan"])
mismatches2 <- data.frame(ofdi=old[fmis, "Global_Trade_and_Investment_Plan"], 
                          nfdi=new[fmis, "Global_Trade_and_Investment_Plan"])