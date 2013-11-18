library(RJSONIO)
library(metrotools)
setwd("/home/alec/ShareDrive/Dropbox/Projects/Brookings/DataViz/GCX/data")

##GEO DATA
latlon <- read.csv("All366Metros_LatLon.csv",stringsAsFactors=FALSE)
latlon$T100 <- latlon$Largest100
#latlon <- latlon[latlon$Largest100==1,]

latlon$name <- nameshort(latlon$Metro_Name,"MetroST")
latlon$shortname <- nameshort(latlon$Metro_Name,"MetST")
latlon$firstcity <- nameshort(latlon$Metro_Name,"Met")

ll <- latlon[,c("CBSA_Code","name","firstcity","Lon","Lat","T100")]
ll$CBSA_Code <- paste("M",ll$CBSA_Code,sep="")

latLonList <- list()
for(i in 1:nrow(ll)){
  latLonList[[ll[i,"CBSA_Code"]]] <- ll[i,c("name","firstcity","Lon","Lat","T100")]
}

setup <- list(metroUniverse=ll$CBSA_Code,metros=latLonList)

#write out json
setupJS <- toJSON(setup)
setupJS <- gsub("\\n","",setupJS)
setupJS <- gsub(":\\s*",":",setupJS)
setupJS <- gsub("\\[\\s*","[",setupJS)
setupJS <- gsub("\\]\\s*","]",setupJS)

writeLines(setupJS,"metros.json")