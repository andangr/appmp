<?php

namespace onestopcore\Http\Controllers\Api;


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use DB;
use onestopcore\Product;
use onestopcore\ProductImage;
use onestopcore\Prdposition;
use onestopcore\Category;
use onestopcore\SubCategory;
use onestopcore\Http\Controllers\Controller;

class ApiProductController extends Controller
{
    /**
     * Show all products.
     * 
     * @return Response
     */
    public function index(){

        $products = Product::all();
        $data = array();
        $i=0;

        if($products){
            foreach($products as $product){
                $data[$i]['product'] = $product;
                $data[$i]['images'] = $product->images;
                $i++;
            }
        }
        return $products;
    }

    /**
     * Edit a Product.
     * 
     * @return Response
     */
    public function edit($id){
       $product = array();
       $product = Product::find($id);
       //echo $id;
       $data = array(
           'product' => $product,
           'images' => $product->images
       );
       return $this->successResponse('Get detail product', $product);
   }

   /**
     * Delete a Product.
     * 
     * @return Response
     */
   public function destroy($id) {

        $deletedRows = ProductImage::where('product_id', $id)->delete();
        $deletedRows = Prdposition::where('product_id', $id)->delete();

        Product::destroy($id);

        return $this->successResponse('Voucher is successfuly deleted');
   }
    
    /**
     * details a Product.
     * 
     * @return Response
     */
    public function details($id){
       $product = array();
       $product = Product::find($id);
       //echo $id;
       $data = array(
           'product' => $product,
           'images' => $product->images[0]
       );
       $oData = $product;
       if($product->images[0]){
            $oData->imagePreviewUrl = $product->images[0]->image_url;
       }
       unset($oData->images);
       $oData->category = $this->_getCategoryName($product->category_id);
       $oData->subcategory =  $this->_getSubCategoryName($product->sub_category_id);
       return $oData;
   }

    private function _getCategoryName($id){
	
        $oData = Category::find($id);

        if($oData){
            return $oData->name;
        }
        return "";
    }

    private function _getSubcategoryName($id){
        
        $oData = SubCategory::find($id);

        if($oData){
            return $oData->name;
        }
        return "";
    }

    /**
     * Create Product.
     *      
     * @param  Request  $request
     * @param  string  $id
     * @return Response
     */
   public function store(Request $request){
      $input = $request->all();
       
      $product_name = $input['product_name'];
      $package_code = $input['package_code']; 
      $price = $input['price']; 
      $category_id = $input['category_id']; 
      $sub_category_id= $input['sub_category_id']; 
      $description = $input['description']; 
      $compatibility = $input['compatibility'];  
      $urldownload = $input['urldownload'];
      $status = $input['status'];
      $images = $input['images'];
      $fileformat = $input['fileformat'];
    
      $datetime = date("Y-m-d h:i:s");

      $next_id = $this->_getNextStatementId('product_id_seq');
      
      $product = new Product;
     
      $product->id = $next_id;
      $product->product_name = $product_name;
      $product->package_code = $package_code;
      $product->price = $price;
      $product->category_id = $category_id;
      $product->sub_category_id = $sub_category_id;
      $product->description = $description;
      $product->compatibility = $compatibility;
      $product->urldownload = $urldownload;
      $product->status = $status;
      $product->created = $datetime;
      $product->save();

      if($images){
            $fileName = md5(uniqid()).'.'.$fileformat;
            $file = $this->base64_to_jpeg($images, public_path().'/storage/'.$fileName);

            $url = Storage::url($fileName);
            $path = 'http://'.$_SERVER['SERVER_NAME'].':'.$_SERVER['SERVER_PORT'].$url;

            $product_image = new ProductImage;
            $product_image->id = $this->_getNextStatementId('product_image_id_seq');
            $product_image->product_id = $next_id;
            $product_image->image_url = $path;
            $product_image->image = $fileName;
            $product_image->image_type_id = 1;
            $product_image->save();
      }
      
      return $this->successResponse('Product is successfuly created.', $product);
   }

   /**
     * Update the given user.
     *      
     * @param  Request  $request
     * @param  string  $id
     * @return Response
     */
   public function update(Request $request, $id){
      $input = $request->all();
       
      $product_name = $input['product_name'];
      $package_code = $input['package_code']; 
      $price = $input['price']; 
      $category_id = $input['category_id']; 
      $sub_category_id= $input['sub_category_id']; 
      $description = $input['description']; 
      $compatibility = $input['compatibility'];  
      $urldownload = $input['urldownload'];
      $status = $input['status'];
      $images = $input['images'];
      $fileformat = $input['fileformat'];
    
      $datetime = date("Y-m-d h:i:s");
      
      $product = Product::find($id);
     
      $product->product_name = $product_name;
      $product->package_code = $package_code;
      $product->price = $price;
      $product->category_id = $category_id;
      $product->sub_category_id = $sub_category_id;
      $product->description = $description;
      $product->compatibility = $compatibility;
      $product->urldownload = $urldownload;
      $product->status = $status;
      $product->save();

      if($images){
            $fileName = md5(uniqid()).'.'.$fileformat;
            $file = $this->base64_to_jpeg($images, public_path().'/storage/'.$fileName);

            $url = Storage::url($fileName);
            $path = 'http://'.$_SERVER['SERVER_NAME'].':'.$_SERVER['SERVER_PORT'].$url;

            $product_image = ProductImage::where('product_id', $id)
                                            ->first();

            $product_image->image_url = $path;
            $product_image->image = $fileName;
            $product_image->save();
      }
      
      return $this->successResponse('Product is successfuly updated.', $product);
   }

   private function base64_to_jpeg($base64_string, $output_file) {
        $ifp = fopen($output_file, "wb"); 

        $data = explode(',', $base64_string);

        fwrite($ifp, base64_decode($data[1])); 
        fclose($ifp); 

        return $output_file; 
    }
    /**
    * @return int
    */
    protected function _getNextStatementId($table)
    {
        $next_id = \DB::select("select nextval('".$table."')");
        return intval($next_id['0']->nextval);
    }
}
