function loadModelByPath( path ) {
    vwf_view.kernel.callMethod( vwf_view.kernel.application(), "loadObject", [ path ] );
}