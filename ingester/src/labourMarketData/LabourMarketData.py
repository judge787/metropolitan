"""
Represents labour market data from the API.
"""

class LabourMarketData:
    """
    Represents a single labour market data record.
    """
    def __init__(self, jsonid="", province="", education_level="", labour_force_status=""):
        """
        __init__: Initializes a new labour market data object.
        """
        self.__jsonid = jsonid  # JSON ID
        self.__province = province  # Province
        self.__education_level = education_level # Highest educational attainment
        self.__labour_force_status = labour_force_status  # Labour force status

    @property
    def jsonid(self):
        """
        jsonid: Gets the JSON ID.
        """
        return self.__jsonid

    @property
    def province(self):
        """
        province: Gets the province.
        """
        return self.__province
    
    @property
    def education_level(self):
        """
        education_level: Gets the education level.
        """
        return self.__education_level
    
    @property
    def labour_force_status(self):
        """
        labour_force_status: Gets the labour force status.
        """
        return self.__labour_force_status
    
    @jsonid.setter
    def jsonid(self, jsonid):
        """
        jsonid: Sets the JSON ID.
        """
        self.__jsonid = jsonid

    @province.setter
    def province(self, province):
        """
        province: Sets the province.
        """
        self.__province = province

    @education_level.setter
    def education_level(self, education_level):
        """
        education_level: Sets the education level.
        """
        self.__education_level = education_level
    
    @labour_force_status.setter
    def labour_force_status(self, labour_force_status):
        """
        labour_force_status: Sets the labour force status.
        """
        self.__labour_force_status = labour_force_status

    def __repr__(self):
        """
        __repr__: Returns a string representation of the object.
        """
        return (
            f"LabourMarketData(jsonid={self.__jsonid!r}, "
            f"LabourMarketData(province={self.__province!r}, "
            f"education_level={self.__education_level!r}, "
            f"labour_force_status={self.__labour_force_status!r})"
        )
            