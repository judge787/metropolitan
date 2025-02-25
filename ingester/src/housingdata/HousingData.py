class HousingData:

    def __init__(self, census_metropolitan_area, month, total_starts, total_complete):
        self.__census_metropolitan_area = census_metropolitan_area
        self.__total_starts = total_starts
        self.__total_complete = total_complete
        self.__month = month

    @property
    def census_metropolitan_area(self):
        """str: Gets the census metropolitan area."""
        return self.__census_metropolitan_area
    
    @property
    def month(self):
        """int: Gets the month."""
        return self.__month

    @property
    def total_starts(self):
        """int: Gets the total number of starts."""
        return self.__total_starts

    @property
    def total_complete(self):
        """int: Gets the total number of completes."""
        return self.__total_complete

    @census_metropolitan_area.setter
    def census_metropolitan_area(self, value):
        """Set the census metropolitan area."""
        self.__census_metropolitan_area = value

    @month.setter
    def month(self, value):
        """Set the month."""
        self.__month = value

    @total_starts.setter
    def total_starts(self, value):
        """Set the total number of starts."""
        self.__total_starts = value

    @total_complete.setter
    def total_complete(self, value):
        """Set the total number of completes."""
        self.__total_complete = value

    def __repr__(self):
        """Return an unambiguous string representation of the HousingData."""
        return (
            f"HousingData(census_metropolitan_area={self.__census_metropolitan_area!r}, "
            f"total_starts={self.__total_starts!r}, "
            f"total_completes={self.__total_complete!r})"
        )


# update wiki to reflect PascalCase for python
