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

        $products = Product::orderBy('id', 'asc')->paginate(10);;
        $data = array();
        $i=0;

        if($products){
            foreach($products as $product){
                $data[$i]['product'] = $product;
                $data[$i]['images'] = $product->images;
                $i++;
            }
        }
        
        return response()->json([
                 'code' => 200,
                 'error' => false,
                 'message' => 'Get Product Successful',
                 'data' => $products]);;
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
        DB::beginTransaction();
        try {
            ProductImage::where('product_id', $id)->delete();
            Prdposition::where('product_id', $id)->delete();
            Product::findOrFail($id)->delete();

        } catch (Exception $e) {
            DB::rollback();
            return response()->json(['code' => 200, 'error' => true, 'message' => 'Failed to delete product'], 200);
        }
        DB::commit();
        return response()->json(['code' => 200, 'error' => false, 'message' => 'Product is deleted'], 200);
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

      $images = $input['images'];
      $fileformat = $input['fileformat'];
      $datetime = date("Y-m-d h:i:s");

      if($images){
          $fileName = md5(uniqid()).'.'.$fileformat;
          $file = $this->base64_to_jpeg($images, public_path().'/storage/'.$fileName);
      }else{
          $fileName = "default.png";
      }

      $url = Storage::url($fileName);
      $path = 'http://'.$_SERVER['SERVER_NAME'].':'.$_SERVER['SERVER_PORT'].$url;
      $next_id = $this->_getNextStatementId('product_id_seq');

      DB::beginTransaction();

        try {
            $input['id'] = $next_id;
            $input['created'] = $datetime;

            unset($input['images']);
            unset($input['status']);
            unset($input['fileformat']);
            Product::create($input);

            try {
                $image = array(
                    'id' => $this->_getNextStatementId('product_image_id_seq'),
                    'product_id' => $next_id,
                    'image_url' => $path,
                    'image' => $fileName,
                    'image_type_id'=> 1
                );
                ProductImage::create($image);
            } catch (Exception $e) {
                DB::rollback();
                return response()->json(['code' => 400, 'error' => true, 'message' => 'Failed to save image'], 200);
            }
        } catch (Exception $e) {
            DB::rollback();
            return response()->json(['code' => 400, 'error' => true, 'message' => 'Failed to save product'], 200);
        }

        DB::commit();
        return response()->json(['code' => 200, 'error' => false, 'message' => 'Product is created'], 200);
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

      $images = $input['images'];
      $datetime = date("Y-m-d h:i:s");

      DB::beginTransaction();

        try {

            $product = Product::findOrFail($id);

            unset($input['status']);
            if($images){
                $fileformat = $input['fileformat'];
                unset($input['fileformat']);
            }
            unset($input['images']);
            

            $product->update($input);

            if($fileformat){
                
                $fileName = md5(uniqid()).'.'.$fileformat;
                $file = $this->base64_to_jpeg($images, public_path().'/storage/'.$fileName);
                $url = Storage::url($fileName);
                $path = 'http://'.$_SERVER['SERVER_NAME'].':'.$_SERVER['SERVER_PORT'].$url;

                try {
                    $product_image = ProductImage::where('product_id', '=', $id)->firstOrFail();;

                    $data_image = array(
                        'id' => $this->_getNextStatementId('product_image_id_seq'),
                        'product_id' => $id,
                        'image_url' => $path,
                        'image' => $fileName,
                        'image_type_id'=> 1
                    );
                    $product_image->update($data_image);

                } catch (Exception $e) {
                    DB::rollback();
                    return response()->json(['code' => 400, 'error' => true, 'message' => 'Failed to save image'], 200);
                }
            }
        } catch (Exception $e) {
            DB::rollback();
            return response()->json(['code' => 400, 'error' => true, 'message' => 'Failed to save product'], 200);
        }

        DB::commit();
        return response()->json(['code' => 200, 'error' => false, 'message' => 'Product is created'], 200);
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
