from django import forms

from .models import Experience, ExperienceImage, Schedule


class ExperienceForm(forms.ModelForm):
    images = forms.CharField(required=True)
    schedule = forms.CharField(required=False)

    class Meta:
        model = Experience
        fields = (
            "type",
            "title",
            "date",
            "keywords",
            "location",
            "start_date",
            "description",
            "duration",
            "participants_limit",
            "price",
            "guide",
            "schedule",
            "images",
        )

    def save(self, commit=True):
        exp = super().save(commit)
        if commit:
            images = self.cleaned_data["images"].split(", ")
            for image in images:
                if image:
                    ExperienceImage.objects.create(url=image, experience=exp)
            # 0-09:00,14:00;3-10:00
            schedule = self.cleaned_data["schedule"].split(";")
            print(schedule)
            for day in schedule:
                if day:
                    day = day.split("-")
                    week_day = day[0]
                    hours = day[1].split(",")
                    for hour in hours:
                        Schedule.objects.create(week_day=week_day, time=hour, experience=exp)
        return exp

    def save_m2m(self):
        return self.instance
