@extends('template')
@section('title', 'Page Title')

@section('topnav')
   @parent
        <div class="container">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="http://172.19.16.156:8020/">1StopClick</a>
            </div>
            <div class="collapse navbar-collapse col-md-6" id="menus">
                
            </div>
        </div>
        
            <nav class="navbar-default navbar-static-side" role="navigation">
                <div class="sidebar-collapse">
                    
                    <ul class="nav metismenu" id="side-menu">
                        <li >
                            <a href="/product"><i class="fa fa-diamond"></i> 
                            <span class="nav-label">Products</span>
                            </a> 
                        </li>
                        <li >
                            <a href="/vouchermg">
                            <i class="fa fa-shopping-cart"></i> 
                            <span class="nav-label">Voucher Management</span>
                            </a>
                        </li>
                    </ul>

                </div>
            </nav>
       
   @endsection
