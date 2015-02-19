library(RJSONIO)
library(metromonitor)
setwd("/home/alec/Dropbox/Projects/Brookings/DataViz/GCX/data")

#For simple update of links, etc., skip to section 2 

##Section 1 - GEO DATA
latlon <- read.csv("All366Metros_LatLon.csv",stringsAsFactors=FALSE)
latlonN <- read.csv("Top100NECTAS_LatLon.csv",stringsAsFactors=FALSE)
cohorts <- read.csv("GCX Cohorts.csv",stringsAsFactors=FALSE,na.strings=c("","NA"))

latlon$T100 <- latlon$Largest100
#latlon <- latlon[latlon$Largest100==1,]

latlon$name <- nameshort(latlon$Metro_Name,"MetroST")
latlon$shortname <- nameshort(latlon$Metro_Name,"MetST")
latlon$firstcity <- nameshort(latlon$Metro_Name,"Met")

latlonN$nm <- nameshort(latlonN$Metro_Name,"MetroST")
latlonN$shrtnm <- nameshort(latlonN$Metro_Name,"MetST")
latlonN$city <- nameshort(latlonN$Metro_Name,"Met")
latlonN$t100 <- latlonN$Largest100
latlonN$gcode <- paste("M",latlonN$CBSA_Code,sep="")
latlonN$lat <- latlonN$Lat
latlonN$lon <- latlonN$Lon
library(jsonlite)
nectas <- toJSON(latlonN[,c("gcode","nm","shrtnm","city","t100","lon","lat")])
writeLines(nectas,"NECTAS100.json")

ll <- merge(latlon,cohorts,by.x="firstcity",by.y="Metro",all.x=TRUE) #imperfect, because non-GCX metros with the same name get tagged, but it won't have an effect

ll <- ll[,c("CBSA_Code","name","firstcity","Lon","Lat","T100","Cohort")]
ll$CBSA_Code <- paste("M",ll$CBSA_Code,sep="")

latLonList <- list()
for(i in 1:nrow(ll)){
  latLonList[[ll[i,"CBSA_Code"]]] <- ll[i,c("name","firstcity","Cohort","Lon","Lat","T100")]
}

setup <- list(metroUniverse=ll$CBSA_Code,metros=latLonList)

#write out json
setupJS <- toJSON(setup)
setupJS <- gsub("\\n","",setupJS)
setupJS <- gsub(":\\s*",":",setupJS)
setupJS <- gsub("\\[\\s*","[",setupJS)
setupJS <- gsub("\\]\\s*","]",setupJS)

writeLines(setupJS,"metros.json")

#Section 2 - web resources
links <- read.csv("WebResources.csv",stringsAsFactors=FALSE,na.strings=c("","NA"))
#links2 <- merge(ll[,c("firstcity","CBSA_Code")],links,by.x="firstcity",by.y="Metro",all.y=TRUE)
#write.csv(links2,file="WebResources.csv",row.names=FALSE)
#add new products
links$Export_Plan_Summary <- paste("/~/media/Multimedia/Interactives/2013/GCXMedia/OverviewDocs/",links$firstcity,".pdf",sep="")
links$Export_Plan_Summary <- ifelse(grepl("Syracuse|Charleston|Des Moines|Los Angeles|Portland|Minneapolis|San Antonio",links$firstcity),links$Export_Plan_Summary,NA)

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
