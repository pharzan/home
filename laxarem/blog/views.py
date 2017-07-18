from django.shortcuts import render
from django.http import HttpResponse
from blog.models import blog
import json
from django.http import JsonResponse
import time
import datetime 
from django.views.decorators.csrf import csrf_exempt
# data = students(studentId=2269)

# Create your views here.
@csrf_exempt
def allTitles(request):
	data={}
	# data = json.loads(d)
	# a = classes.objects.get(id=id)
	if request.method == 'GET':
		return HttpResponse('no blogs to see here!')
	if request.method == 'POST':
		payload = request.body
		payload_unicode = request.body.decode('utf-8')
		payload_json = json.loads(payload_unicode)
		if (payload_json['field'] == 'titles'):

			titles = blog.objects.values_list('id','title','modifiedDate')
			
			for idx,title in enumerate(titles):
				print(title)
				data[idx]={"title":title[1],
							"modifiedDate":str(title[2])
								
				}
				# print(modifiedDate[idx][1])

			
			jsnData = json.dumps(data)
			
		elif (payload_json['field'] == 'post'):

			obj = blog.objects.get(blogId=payload_json['idx'])
			print(obj.body)
			data={"body":obj.body}
			jsnData = json.dumps(data)
		else:
			jsnData = "{}"
		return JsonResponse(jsnData,safe=False)
	print('DONE')

def convertDatetimeToString(o):
	DATE_FORMAT = "%Y-%m-%d" 
	TIME_FORMAT = "%H:%M:%S"

	if isinstance(o, datetime.date):
	    return o.strftime(DATE_FORMAT)
	elif isinstance(o, datetime.time):
	    return o.strftime(TIME_FORMAT)
	elif isinstance(o, datetime.datetime):
	    return o.strftime("%s %s" % (DATE_FORMAT, TIME_FORMAT))
# Create your views here.