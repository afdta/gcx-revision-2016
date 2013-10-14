######################################################################################################################################
#                                                                                                                                    #    
#                                               Organize data for profile generator                                                  #
#                                                                                                                                    #
######################################################################################################################################

setwd("/home/alec/ShareDrive/Dropbox/Projects/Brookings/Dashboards/ProfileGenerator/data")
library(metromonitor)
library(metrotools)
library(RJSONIO)

# Import profile inventory
# Data dictionary:
#   PID: Product ID (YYYY + MM + DD)
#   Product: Title of product (typically the report title)
#   Dir: The location of profiles on the web server
#   Naming: Naming convention of profiles (Metro indicates full metro name, Met indicates the first city name, State(s) indicates state name(s), ST(s) indicates state abbreviation(s))
#   States: Boolean indicating whether the profiles cover states
#   Metros: Boolean indicating whether the profiles cover metros (assumed to be top 100)
#   
inventory <- read.csv("Research inventory.csv")
nrow(inventory)
descriptions <- read.csv("Research descriptions.csv")
inventory <- merge(inventory,descriptions[,c("PID","Description")],by="PID")
nrow(inventory)

metros <- metropops(FALSE)
metros$MetroName <- nameshort(metros$Metro_Name,type="MetroST")
metros$ShortName <- nameshort(metros$Metro_Name,type="MetST")
metros$FirstCity <- nameshort(metros$Metro_Name,type="Met")

metros$Metro <- nameshort(metros$Metro_Name,type="Metro",rmPunc=TRUE)
metros$MetroNS <- gsub("_","",metros$Metro)
metros$Met <- nameshort(metros$Metro_Name,type="Met",rmPunc=TRUE)
metros$MetNS <- gsub("_","",metros$Met)
metros$Code <- metros$CBSA_Code
metros$MCode <- paste("M",metros$CBSA_Code,sep="")
metros$ST <- nameshort(metros$Metro_Name,type="ST",rmPunc=TRUE)
metros$ST1 <- nameshort(metros$Metro_Name,type="ST1",rmPunc=TRUE)
metros <- metros[,c("Code","MCode","MetroName","ShortName","FirstCity","Metro","MetroNS","Met","MetNS","ST","ST1","Pop2010SF1","Largest100")]

metlist <- list()
for(i in 1:nrow(metros)){
  metlist[[i]] <- metros[i,]
}

json <- toJSON(metlist)


#convert resarch database to a list
rsConvert <- function(ds,i){
  l <- as.list(ds[i,])
  a <- strsplit(as.character(l$Authors),",\\s")[[1]]
  l$Authors <- lapply(a,function(e){return(e)})
  return(l)
}

researchlist <- list()
for(i in 1:nrow(inventory)){
  researchlist[[i]] <- rsConvert(inventory,i)
}

rjson <- toJSON(researchlist)

writeLines(json,"Metros.json")
writeLines(rjson,"Research.json")
