

function castCircle(source, radius, angle, color) {
	var miniMapObjects = $("minimapobjects");
	var objectCtx=miniMapObjects.getContext("2d");

	objectCtx.fillStyle = color;
	objectCtx.beginPath();
	objectCtx.arc(source.x*miniMapScale,
		source.y*miniMapScale,radius*miniMapScale,source.rot-(angle/2)/180*Math.PI,
		source.rot+(angle/2)/180*Math.PI);
	objectCtx.lineTo(source.x * miniMapScale,
		source.y * miniMapScale);
	objectCtx.fill();
}
