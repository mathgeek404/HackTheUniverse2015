//
//  ViewController.m
//  PebbleTest
//
//  Created by Rishi Masand on 8/15/15.
//  Copyright (c) 2015 Rishi Masand. All rights reserved.
//

#import "ViewController.h"
#import <PebbleKit/PebbleKit.h>
#import <CoreLocation/CoreLocation.h>

@interface ViewController () <PBPebbleCentralDelegate>

@property PBWatch *connectedWatch;
@property NSUserDefaults *userDefaults;
@property NSInteger payAmount;

@end

@implementation ViewController

@synthesize key, value, identifier, password, address;

CLLocationManager *locationManager;

- (void)viewDidLoad {
    [super viewDidLoad];
    
    locationManager = [[CLLocationManager alloc] init];
    
    self.userDefaults = [NSUserDefaults standardUserDefaults];
    // Do any additional setup after loading the view, typically from a nib.
    
    identifier.text = [self.userDefaults stringForKey:@"identifier"];
    address.text = [self.userDefaults stringForKey:@"address"];
    password.text = [self.userDefaults stringForKey:@"password"];
    
    locationManager.delegate = self;
    locationManager.desiredAccuracy = kCLLocationAccuracyBest;
    
    [locationManager requestWhenInUseAuthorization];
    [locationManager requestAlwaysAuthorization];
    
    [locationManager startUpdatingLocation];
    
    self.connectedWatch = [[PBPebbleCentral defaultCentral] lastConnectedWatch];
    NSLog(@"Last connected watch: %@", self.connectedWatch);

    
    uuid_t myAppUUIDbytes;
    NSUUID *myAppUUID = [[NSUUID alloc] initWithUUIDString:@"d07e77d4-250f-4efe-ab9a-3df2d6648905"];
    [myAppUUID getUUIDBytes:myAppUUIDbytes];
    
    
    
    [self.connectedWatch appMessagesLaunch:^(PBWatch *watch, NSError *error) {
        if (!error) {
            NSLog(@"Successfully launched app.");
        }
        else {
            NSLog(@"Error launching app - Error: %@", error);
        }
    }
     ];
    
    [[PBPebbleCentral defaultCentral] setAppUUID:[NSData dataWithBytes:myAppUUIDbytes length:16]];
    
    NSDictionary *update = @{ @(0):[NSNumber numberWithUint8:42],
                              @(1):@"a string" };
    [self.connectedWatch appMessagesPushUpdate:update onSent:^(PBWatch *watch, NSDictionary *update, NSError *error) {
        if (!error) {
            NSLog(@"Successfully sent message.");
        }
        else {
            NSLog(@"Error sending message: %@", error);
        }
    }];
    
    [self.connectedWatch appMessagesAddReceiveUpdateHandler:^BOOL(PBWatch *watch, NSDictionary *update) {
        NSLog(@"Received message: %@", update);
        NSLog(@"Something: %@", [update allKeys][0]);
        key.text = [NSString stringWithFormat:@"%@",[update allKeys][0]];
        NSLog(@"Something else: %@", update[[update allKeys][0]]);
        value.text = [NSString stringWithFormat:@"%@", update[[update allKeys][0]]];
        
        if ([update[[update allKeys][0]] integerValue] > 0) {
            self.payAmount = [update[[update allKeys][0]] integerValue];
            [self save:nil];
        } else {
            [self receive:nil];
        }
        
        return YES;
    }];


}
- (IBAction)receive:(id)sender {
    
    //pebble triggered receive
    
    NSLog(@"Pebble triggered receive!");
    
    NSURL *url = [NSURL URLWithString:@"http://bc4d3bf1.ngrok.io/receive"];
    
    NSMutableURLRequest *request = [[NSMutableURLRequest alloc] initWithURL:url];
    
    NSDictionary *tmp = [[NSDictionary alloc] initWithObjectsAndKeys: [[NSNumber alloc] initWithDouble:[self.userDefaults doubleForKey:@"lat"]], @"lat", [[NSNumber alloc] initWithDouble:[self.userDefaults doubleForKey:@"lon"]], @"lon", [self.userDefaults stringForKey:@"address"], @"address", nil];
    NSError *error;
    NSData *postdata = [NSJSONSerialization dataWithJSONObject:tmp options:0 error:&error];
    [request setHTTPBody:postdata];
    
    [request setHTTPMethod:@"POST"];
    
    [request setValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
    
    NSURLConnection *conn = [[NSURLConnection alloc] initWithRequest:request delegate:self];
    
    [conn start];
}

- (void)locationManager:(CLLocationManager *)manager didFailWithError:(NSError *)error
{
    NSLog(@"didFailWithError: %@", error);
    UIAlertView *errorAlert = [[UIAlertView alloc]
                               initWithTitle:@"Error" message:@"Failed to Get Your Location" delegate:nil cancelButtonTitle:@"OK" otherButtonTitles:nil];
    [errorAlert show];
}

- (void)locationManager:(CLLocationManager *)manager didUpdateToLocation:(CLLocation *)newLocation fromLocation:(CLLocation *)oldLocation
{
    NSLog(@"didUpdateToLocation: %@", newLocation);
    CLLocation *currentLocation = newLocation;
    
    if (currentLocation != nil) {
        [self.userDefaults setDouble:currentLocation.coordinate.latitude forKey:@"lat"];
        [self.userDefaults setDouble:currentLocation.coordinate.longitude forKey:@"lon"];
    }
}

- (IBAction)save:(id)sender {
    
    [self.userDefaults setObject:identifier.text forKey:@"identifier"];
    [self.userDefaults setObject:password.text forKey:@"password"];
    [self.userDefaults setObject:address.text forKey:@"address"];
    
    
    //pebble triggered give
    
    NSLog(@"Pebble triggered give with amount: %li!", (long)self.payAmount);
    
    //NSNumber *amount = [[NSNumber alloc] initWithInt:10000];
    
    
    NSURL *url = [NSURL URLWithString:@"http://bc4d3bf1.ngrok.io/give"];
    
    NSMutableURLRequest *request = [[NSMutableURLRequest alloc] initWithURL:url];
    
    NSDictionary *tmp = [[NSDictionary alloc] initWithObjectsAndKeys: [[NSNumber alloc] initWithInt:self.payAmount], @"amount", [[NSNumber alloc] initWithDouble:[self.userDefaults doubleForKey:@"lat"]], @"lat", [[NSNumber alloc] initWithDouble:[self.userDefaults doubleForKey:@"lon"]], @"lon", [self.userDefaults stringForKey:@"identifier"], @"identifier", [self.userDefaults stringForKey:@"password"], @"password", [self.userDefaults stringForKey:@"address"], @"address", nil];
    NSError *error;
    NSData *postdata = [NSJSONSerialization dataWithJSONObject:tmp options:0 error:&error];
    [request setHTTPBody:postdata];
    
    [request setHTTPMethod:@"POST"];
    
    [request setValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
    
    NSURLConnection *conn = [[NSURLConnection alloc] initWithRequest:request delegate:self];
    
    [conn start];
    
    
}



- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
