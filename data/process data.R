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

#web resources
links <- read.csv("WebResources.csv",stringsAsFactors=FALSE,na.strings=c("","NA"))
#links2 <- merge(ll[,c("firstcity","CBSA_Code")],links,by.x="firstcity",by.y="Metro",all.y=TRUE)
#write.csv(links2,file="WebResources.csv",row.names=FALSE)
#add new products
links$Exports_Plan_Summary <- paste("/~/media/Multimedia/Interactives/2013/GCXMedia/OverviewDocs/",links$firstcity,".pdf",sep="")
links$Exports_Plan_Summary <- ifelse(grepl("Syracuse|Charleston|Des Moines|Los Angeles|Portland|Minneapolis|San Antonio",links$firstcity),links$Exports_Plan_Summary,NA)

products <- names(links)[-1:-2]
linklist <- list()
for(i in 1:nrow(links)){
  tmp <- list()
  for(j in 1:length(products)){
    tmp[[j]] <- list(name=gsub("_"," ",products[j]),link=links[i,products[j]])
  }
  linklist[[links[i,"CBSA_Code"]]] <- tmp
  rm(tmp)
}
linkjson <- toJSON(linklist)
writeLines(linkjson,"links.json")