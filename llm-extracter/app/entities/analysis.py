from tortoise import fields
from tortoise.models import Model


class Analysis(Model):
    id = fields.IntField(pk=True)
    input_text = fields.TextField()
    summary = fields.TextField()
    title = fields.CharField(max_length=255, null=True)
    topics = fields.JSONField()
    sentiment = fields.CharField(max_length=16)
    keywords = fields.JSONField()
    confidence = fields.FloatField(null=False, default=0.5)
    created_at = fields.DatetimeField(auto_now_add=True)

    class Meta:
        table = "analysis"


